(ns app.canvas
  (:require ["./pixel.js" :as pixel]))

;; >> Configuration

(def config
  {:padding 60
   :grid-divisions 10
   :handle-width 8
   :point-radius 8
   ;; CSS pixels per drawn pixel
   :cell 2
   ;; Cells over which an edge that runs to infinity fades out
   :fade 16
   :font "11px 'Departure Mono', ui-monospace, monospace"})

(defn theme-colors []
  (let [style (js/getComputedStyle js/document.documentElement)
        css-var #(.trim (.getPropertyValue style %))]
    {:bg (css-var "--bg")
     :text (css-var "--text")
     :heading (css-var "--heading")
     :border (css-var "--border")
     :accent (css-var "--accent")}))

(defn ->cell [px]
  (js/Math.round (/ px (:cell config))))

(defn fill-cell! [ctx col row]
  (let [cell (:cell config)]
    (.fillRect ctx (* col cell) (* row cell) cell cell)))

(defn fill-cells! [ctx col1 row1 col2 row2]
  "Fill the cells from (col1, row1) up to but excluding (col2, row2)."
  (let [cell (:cell config)]
    (.fillRect ctx (* col1 cell) (* row1 cell) (* (- col2 col1) cell) (* (- row2 row1) cell))))

(defn plot-area [width height padding]
  {:left (->cell padding)
   :right (->cell (- width padding))
   :top (->cell padding)
   :bottom (->cell (- height padding))})

;; >> Drawing Helpers

(defn clear-canvas! [ctx width height colors]
  (set! (.-fillStyle ctx) (:bg colors))
  (.fillRect ctx 0 0 width height))

(defn draw-grid! [ctx width height padding divisions color]
  (let [{:keys [left right top bottom]} (plot-area width height padding)
        step-x (/ (- width (* 2 padding)) divisions)
        step-y (/ (- height (* 2 padding)) divisions)]
    (set! (.-fillStyle ctx) color)
    (doseq [i (range (inc divisions))]
      (let [col (->cell (+ padding (* i step-x)))
            row (->cell (- height padding (* i step-y)))]
        (doseq [r (range top bottom 2)]
          (fill-cell! ctx col r))
        (doseq [c (range left right 2)]
          (fill-cell! ctx c row))))))

(defn draw-axes! [ctx width height padding colors]
  (let [{:keys [left right top bottom]} (plot-area width height padding)]
    (set! (.-fillStyle ctx) (:heading colors))
    (fill-cells! ctx left bottom (inc right) (inc bottom))
    (fill-cells! ctx left top (inc left) (inc bottom))
    (doseq [k (range 4)]
      (fill-cells! ctx (- right k) (- bottom k) (- (inc right) k) (+ bottom k 1))
      (fill-cells! ctx (- left k) (+ top k) (+ left k 1) (+ top k 1)))))

(defn draw-axis-labels! [ctx width height padding colors]
  (set! (.-fillStyle ctx) (:text colors))
  (set! (.-font ctx) (:font config))
  (set! (.-textAlign ctx) "center")
  (set! (.-textBaseline ctx) "top")
  (.fillText ctx "VALID TIME" (/ width 2) (- height padding -32))
  (.save ctx)
  (.translate ctx (- padding 40) (/ height 2))
  (.rotate ctx (- (/ js/Math.PI 2)))
  (set! (.-textAlign ctx) "center")
  (set! (.-textBaseline ctx) "bottom")
  (.fillText ctx "SYSTEM TIME" 0 0)
  (.restore ctx))

(defn draw-ticks! [ctx width height padding divisions colors]
  (let [{:keys [left bottom]} (plot-area width height padding)
        cell (:cell config)
        step-x (/ (- width (* 2 padding)) divisions)
        step-y (/ (- height (* 2 padding)) divisions)
        tick-cells 3]
    (set! (.-font ctx) (:font config))
    (doseq [i (range (inc divisions))]
      (let [col (->cell (+ padding (* i step-x)))
            row (->cell (- height padding (* i step-y)))]
        (set! (.-fillStyle ctx) (:heading colors))
        (fill-cells! ctx col bottom (inc col) (+ bottom tick-cells 1))
        (fill-cells! ctx (- left tick-cells) row left (inc row))
        (set! (.-fillStyle ctx) (:text colors))
        (set! (.-textAlign ctx) "center")
        (set! (.-textBaseline ctx) "top")
        (.fillText ctx (str "t" i) (* col cell) (* (+ bottom tick-cells 2) cell))
        (set! (.-textAlign ctx) "right")
        (set! (.-textBaseline ctx) "middle")
        (.fillText ctx (str "t" i) (* (- left tick-cells 1) cell) (* row cell))))))

;; >> Event Rendering

(defn rgb->css [[r g b]]
  (str "rgb(" r "," g "," b ")"))

(defn event-cells [event width height padding]
  (let [{:keys [_valid_from _valid_to _system_from]} event
        draw-width (- width (* 2 padding))
        draw-height (- height (* 2 padding))]
    {:left (->cell (+ padding (* _valid_from draw-width)))
     :right (->cell (+ padding (* (or _valid_to 1) draw-width)))
     :top (->cell padding)
     :bottom (->cell (- height padding (* _system_from draw-height)))}))

(defn draw-event! [ctx event width height padding selected? colors]
  (let [{:keys [_valid_to color]} event
        {:keys [left right top bottom]} (event-cells event width height padding)
        open? (nil? _valid_to)
        fade (:fade config)
        edge-width (if selected? 2 1)
        fill (rgb->css color)
        edge (if selected? (:heading colors) (rgb->css (pixel/outline color)))
        handle-cells (->cell (:handle-width config))
        edge? (fn [c r]
                (or (< c (+ left edge-width))
                    (>= r (- bottom edge-width))
                    (and (not open?) (>= c (- right edge-width)))))
        ;; The top runs to system time ∞, and an open event's right edge to valid time ∞.
        depth (fn [c r]
                (min (- r top)
                     (if open? (- right 1 c) fade)))
        fading (vec (for [r (range top (min bottom (+ top fade)))
                          c (range left right)
                          :when (< (depth c r) fade)]
                      [c r]))
        fading (if open?
                 (into fading (for [r (range (+ top fade) bottom)
                                    c (range (max left (- right fade)) right)]
                                [c r]))
                 fading)]
    (when (and (< left right) (< top bottom))
      (set! (.-fillStyle ctx) fill)
      (fill-cells! ctx left top right bottom)
      (when-not open?
        (set! (.-fillStyle ctx) edge)
        (doseq [r (range top bottom)
                c (range (- right handle-cells) right)
                :when (even? (+ c r))]
          (fill-cell! ctx c r)))
      (set! (.-fillStyle ctx) edge)
      (fill-cells! ctx left top (+ left edge-width) bottom)
      (fill-cells! ctx left (- bottom edge-width) right bottom)
      (when-not open?
        (fill-cells! ctx (- right edge-width) top right bottom))
      (set! (.-fillStyle ctx) (:bg colors))
      (doseq [[c r] fading]
        (fill-cell! ctx c r))
      (let [lit (filter (fn [[c r]] (pixel/fadeLit c r (depth c r) fade)) fading)]
        (set! (.-fillStyle ctx) fill)
        (doseq [[c r] (remove (fn [[c r]] (edge? c r)) lit)]
          (fill-cell! ctx c r))
        (set! (.-fillStyle ctx) edge)
        (doseq [[c r] (filter (fn [[c r]] (edge? c r)) lit)]
          (fill-cell! ctx c r))))))

(defn draw-events! [ctx events width height padding selected colors]
  (let [indexed-events (map-indexed vector events)
        sorted-events (sort-by #(:_system_from (second %)) indexed-events)]
    (doseq [[idx event] sorted-events]
      (draw-event! ctx event width height padding (contains? selected idx) colors))))

;; >> Point Rendering

(defn draw-point! [ctx point width height padding selected? colors]
  (let [{:keys [x y color]} point
        draw-width (- width (* 2 padding))
        draw-height (- height (* 2 padding))
        col (->cell (+ padding (* x draw-width)))
        row (->cell (- height padding (* y draw-height)))
        radius (/ (:point-radius config) (:cell config))
        disc! (fn [r style]
                (set! (.-fillStyle ctx) style)
                (doseq [[dx dy] (pixel/disc r)]
                  (fill-cell! ctx (+ col dx) (+ row dy))))]
    (when selected?
      (disc! (inc radius) (:heading colors)))
    (disc! radius (if selected? (:heading colors) (rgb->css (pixel/outline color))))
    (disc! (dec radius) (rgb->css color))))

(defn draw-points! [ctx points width height padding selected-points colors]
  (doseq [[idx point] (map-indexed vector points)]
    (draw-point! ctx point width height padding (contains? selected-points idx) colors)))

(defn normalized-box
  "Cell bounds of a box given as two corners in 0..1 coordinates."
  [box width height padding]
  (let [{:keys [x1 y1 x2 y2]} box
        draw-width (- width (* 2 padding))
        draw-height (- height (* 2 padding))]
    {:left (->cell (+ padding (* (min x1 x2) draw-width)))
     :right (->cell (+ padding (* (max x1 x2) draw-width)))
     :top (->cell (- height padding (* (max y1 y2) draw-height)))
     :bottom (->cell (- height padding (* (min y1 y2) draw-height)))}))

(defn draw-dashed-outline! [ctx {:keys [left right top bottom]} on off]
  (let [perimeter (concat (for [c (range left right)] [c top])
                          (for [r (range top bottom)] [(dec right) r])
                          (for [c (range (dec right) (dec left) -1)] [c (dec bottom)])
                          (for [r (range (dec bottom) (dec top) -1)] [left r]))]
    (doseq [[i [c r]] (map-indexed vector perimeter)
            :when (< (mod i (+ on off)) on)]
      (fill-cell! ctx c r))))

(defn draw-selection-box! [ctx width height padding selection-box colors]
  (when selection-box
    (let [{:keys [start end]} selection-box
          {:keys [left right top bottom] :as box}
          (normalized-box {:x1 (:x start) :y1 (:y start) :x2 (:x end) :y2 (:y end)}
                          width height padding)]
      (set! (.-fillStyle ctx) (:accent colors))
      (doseq [r (range top bottom)
              c (range left right)
              :when (and (even? c) (even? r))]
        (fill-cell! ctx c r))
      (draw-dashed-outline! ctx box 2 2))))

(defn draw-vt-eq-st-line! [ctx width height padding colors]
  "Draw a dashed diagonal from (vt=0, st=0) to (vt=1, st=1) on top of everything."
  (let [{:keys [left right top bottom]} (plot-area width height padding)]
    (set! (.-fillStyle ctx) (:heading colors))
    (doseq [[i [c r]] (map-indexed vector (pixel/lineCells left bottom right top))
            :when (< (mod i 6) 3)]
      (fill-cell! ctx c r))))

(defn draw-zoom-rect! [ctx rect width height padding colors]
  "Draw the shared zoom rectangle as a dashed outline on top of events."
  (when rect
    (set! (.-fillStyle ctx) (:accent colors))
    (draw-dashed-outline! ctx (normalized-box rect width height padding) 3 2)))

;; >> Main Render Function

(defn render-canvas! [canvas events opts]
  (when canvas
    (let [ctx (.getContext canvas "2d")
          width (.-width canvas)
          height (.-height canvas)
          padding (:padding config)
          divisions (:grid-divisions config)
          colors (theme-colors)
          show-grid (get opts :show-grid false)
          show-ticks (get opts :show-ticks false)
          show-vt-eq-st (get opts :show-vt-eq-st false)
          selection-box (get opts :selection-box)
          zoom-rect (get opts :zoom-rect)
          zoom-rect-draft (get opts :zoom-rect-draft)
          selected (or (get opts :selected) #{})
          points (or (get opts :points) [])
          selected-points (or (get opts :selected-points) #{})]
      ;; Pass 1: Background
      (clear-canvas! ctx width height colors)
      (draw-grid! ctx width height padding divisions (:border colors))
      (draw-axes! ctx width height padding colors)
      (draw-axis-labels! ctx width height padding colors)
      (when show-ticks
        (draw-ticks! ctx width height padding divisions colors))
      ;; Pass 2: Events (use 0..1 normalized coordinates)
      (draw-events! ctx events width height padding selected colors)
      ;; Pass 3: Points (always on top of events)
      (draw-points! ctx points width height padding selected-points colors)
      ;; Pass 4: Foreground grid
      (when show-grid
        (draw-grid! ctx width height padding divisions (:text colors)))
      ;; Pass 5: Selection box (drawn on top)
      (draw-selection-box! ctx width height padding selection-box colors)
      ;; Pass 6: Zoom rectangle (in-progress draft replaces committed one)
      (draw-zoom-rect! ctx (or zoom-rect-draft zoom-rect) width height padding colors)
      ;; Pass 7: vt = st diagonal (drawn over everything)
      (when show-vt-eq-st
        (draw-vt-eq-st-line! ctx width height padding colors)))))
