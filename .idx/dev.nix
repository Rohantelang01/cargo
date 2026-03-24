nix
idx.previews = {
  previews = {
    web = {
      command = [
        "npm"
        "run"
        "dev"
        "--"
        "--port"
        "$PORT"
        "--hostname"
        "0.0.0.0"
      ];
      manager = "web";
    };
  };
};
