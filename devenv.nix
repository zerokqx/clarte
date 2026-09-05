{
  pkgs,
  ...
}:

{

  packages = [
    pkgs.git
    pkgs.protobuf
    pkgs.openssl
    pkgs.minio-client
    pkgs.cloc
  ];

  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };
  scripts.line-count.exec = " cloc ./apps ./packages  --exclude-dir=node_modules,build,dist,.next,out,.turbo,coverage";

  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

}
