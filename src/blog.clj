(ns blog
  (:require
    [quickblog.api :as q]
    [quickblog.internal :as lib]
    [selmer.parser :as selmer]
    [babashka.fs :as fs]))

(defn ensure-template! [{:keys [templates-dir]} template-name]
  (let [template-file (fs/file templates-dir template-name)]
    (if-not (fs/exists? template-file)
      (do (println (str "ERROR: Template not found: " template-name))
          (System/exit 1))
      template-file)))

(defn spit-404 [opts]
  (let [{:keys [blog-title blog-description
                blog-image blog-image-alt twitter-handle
                out-dir]
         :as opts} (q/apply-default-opts opts)
        out-file (fs/file out-dir "404.html")
        title (str blog-title " - Page Not Found")
                        
        template (ensure-template! opts "404.html")
        #_#_ ; For when I want to add some variables
        body (selmer/render (slurp template) {})
        body (slurp template)]
    (lib/write-page! opts out-file
                     (q/base-html opts)
                     {:skip-archive true
                      :title title
                      :body body
                      :sharing {:description (format "404 - %s" blog-description)
                                :author twitter-handle
                                :twitter-handle twitter-handle
                                :image (lib/blog-link opts blog-image)
                                :image-alt blog-image-alt
                                :url (lib/blog-link opts "404.html")}})))
