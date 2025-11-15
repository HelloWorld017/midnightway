# Midnightway
Yet another webkit-based wayland bar, dock, and panels.

## Installation
> [!WARNING]
> `midnightway` is not stable and not recommended for daily use.

```nix
# 1. Add `midnightway` to the flake input
midnightway = {
	url = "github:HelloWorld017/midnightway/v1.1.0";
	inputs.nixpkgs.follows = "nixpkgs";
};

# 2. Use the package
inputs.midnightway.packages.${system}.default
```

## Configuration
Unfortunately, There is currently no documentation for the configuration.  
Please refer to the [schema code](https://github.com/HelloWorld017/midnightway/blob/91cab12a61e4efd8b82bdf2448b8886ec1746cdf/src/config/schema.ts#L81).

The configuration file is on the `~/.config/midnightway/config.json`.  

### Example
```nix
# In home-manager
xdg.configFile."midnightway/config.json".text = builtins.toJSON {
  locale = "ko-KR";
  bar = {
    autohide = true;
    status = {
      items = [
        { kind = "network"; visibility = "full"; }
        { kind = "battery"; visibility = "full"; }
        { kind = "sound"; visibility = "default"; }
        { kind = "temperature"; visibility = "default"; }
        { kind = "performance"; visibility = "default"; }
      ];
    };
  };
  weather = {
    location = "Seoul, Korea";
    apiToken = "YOUR_OPENWEATHERAPI_TOKEN";
  };
  system = {
    gpuCard = "renderD128";
    networkInterface = "wlo1";
  };
};
```
## Screenshots
### Bar
<img width="2882" height="166" alt="image" src="https://github.com/user-attachments/assets/88d94cfc-eccf-4718-998f-7645083f45f3" />
<img width="2874" height="148" alt="image" src="https://github.com/user-attachments/assets/1db2e10d-b98c-4997-84eb-63eb3ff8afde" />

### Panels 🚧
<img width="349" height="344" alt="image" src="https://github.com/user-attachments/assets/adccfa93-9d0a-48d5-b680-3d793700bd5c" />
<img width="349" height="344" alt="image" src="https://github.com/user-attachments/assets/694dd122-c966-4a8e-b32b-c20396d8d9aa" />
<img width="344" height="373" alt="image" src="https://github.com/user-attachments/assets/b9a3536e-db62-49af-b3c3-88b8e42c8e34" />
