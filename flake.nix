{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    nix-pin.url = "github:akeboshiwind/nix-pin";
  };

  outputs = { self, nixpkgs, flake-utils, nix-pin }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.hugo
        ];
        shellHook = ''
          exec fish
        '';
      };
    });
}
