{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };

    systems = {
      url = "github:nix-systems/default-linux";
    };
  };

  outputs = { self, nixpkgs, astal, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      astalPkgs = astal.packages.${system};
      deps = [
        astalPkgs.astal4
        astalPkgs.io
        astalPkgs.gjs
        pkgs.nodejs_23
        pkgs.nodePackages.pnpm
      ];
    in {
      packages.default = pkgs.stdenvNoCC.mkDerivation rec {
        name = "midnightway";
        src = ./.;

        nativeBuildInputs = [
          pkgs.wrapGAppsHook
          pkgs.gobject-introspection
        ];

        buildInputs = deps;

        installPhase = ''
          mkdir -p $out/bin
          pnpm build $out/bin/${name}
        '';
      };

      devShells.default = pkgs.mkShell {
        packages = deps;
        shellHook = ''
          export EXTERN_ASTAL="${astalPkgs.gjs}/share/astal/gjs";
          export VIRTUAL_ENV="midnightway";
        '';
      };
    });
}
