# MLVScan

MLVScan is a security-focused MelonLoader plugin designed to detect and disable potentially malicious mods before they can harm your system. It scans for suspicious patterns commonly found in malware and prevents them from executing.

MLVScan was created in response to the recent uprising of malware mods being uploaded to sites like NexusMods.

![MLVScan Example](https://raw.githubusercontent.com/ifBars/MLVScan/refs/heads/master/example.png)

## Features

- **Pre-load Scanning**: Catches malicious code before it can execute
- **Modular Detection Rules**: Identifies various malicious patterns
- **Severity Classification**: Categorizes threats by risk level (Critical, High, Medium, Low)
- **Automatic Disabling**: Prevents suspicious mods from loading
- **Detailed Reports**: Generates comprehensive scan reports with specific findings
- **Whitelisting**: Allows trusted mods to bypass scanning (Most mods pass the scan just fine, with a few that have been whitelisted due to false positives, the current whitelist system is planned to be replaced with an improved version in the future)
- **Security Guidance**: Provides actionable steps if a threat is detected

## Installation

1. Download the latest release from the [Releases page](https://github.com/ifBars/MLVScan/releases)
2. Place `MLVScan.dll` in your game's `Plugins` folder
3. Launch your game

## How It Works

MLVScan analyzes all mods before they are loaded by MelonLoader. It uses static analysis to scan for suspicious code patterns without executing them. When a potentially malicious mod is detected, MLVScan:

1. Prevents the mod from loading
2. Logs detailed information about the suspicious patterns
3. Creates a report file with findings and remediation steps
4. Provides security guidance if your system might be affected

## Usage

MLVScan works automatically when your game starts. No additional configuration is required for basic protection.

### Whitelist Configuration

To whitelist trusted mods that might trigger false positives:

1. Edit `MelonPreferences.cfg` in your game directory
2. Find the `[MLVScan]` section
3. Add mod filenames to the `WhitelistedMods` setting
4. Save the file

Example:

```
[MLVScan]
WhitelistedMods = S1APILoader.dll, S1API.Mono.dll, S1API.Il2Cpp.dll, CustomTV_Mono.dll, CustomTV_IL2CPP.dll
```

⚠️ **Warning**: Only whitelist mods from trusted sources. Whitelisted mods fully bypass security checks.

## Security Report Interpretation

When MLVScan detects a suspicious finding, it will generate a report with findings categorized by severity, and disable the mod if the severity is within the configured threshold:

- **Critical**: High-risk activities like executing external processes or loading assemblies
- **High**: Potentially dangerous behaviors like loading encrypted or obfuscated data
- **Medium**: Suspicious patterns that might be legitimate in some contexts
- **Low**: Minor suspicious patterns with little to no risk

Review the details carefully before deciding to whitelist a mod.

## Roadmap / Feature Ideas

- **Hash-based Whitelist**: Verify mod authenticity using cryptographic hashes instead of filenames
- **Smart Pattern Analysis**: Reduce false positives through contextual analysis
- **Behavior Monitoring**: Runtime detection of suspicious behavior
- **GUI Interface**: User-friendly interface for managing security settings
- **Mod Publisher Verification**: Support for digitally signed mods from trusted developers
- **Custom Rules Configuration**: Allow users to define custom detection rules

## Contributing

Contributions are welcome! If you'd like to improve MLVScan:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Adding a new detection rule is a simple as:

1. Creating your rule class in the `Models` folder
2. Declaring it as a public class that inherits the IScanRule interface
3. Declare your IsSuspicious(MethodReference) method
4. Declare a Description and Severity for your rule
5. Add your rule to ServiceFactory.CreateAssemblyScanner

Reference the existing rule model classes for an example.

## License

This project is licensed under the GNU GPL v3 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MelonLoader team for creating the mod loading framework
- Mono.Cecil for enabling assembly analysis

## Disclaimer

MLVScan is provided as-is without warranty. While it can detect many malicious patterns, no security tool is perfect, and cyber security is a never ending battle of cat and mouse. Always exercise caution when installing newer mods, and NEVER install mods from untrusted sources. Trusted mod sources are NexusMods and Thunderstore, however you should always be weary of new mods.

# MLVScan Threat Database

This repository contains the MLVScan website and threat database. The threat database is a collection of known malicious mods detected by MLVScan and the community.

## Updating the Threat Database

The threat database is stored in the `public/data/threats.json` file. This file is fetched by the website at runtime, making it easy to update the database without having to redeploy the entire website.

### How to Update the Threat Database

1. Fork this repository
2. Make changes to the `public/data/threats.json` file
3. Submit a pull request

Or if you have direct write access:

1. Edit the `public/data/threats.json` file directly through GitHub's web interface
2. Commit your changes

### Threat Data Structure

Each threat in the database has the following structure:

```json
{
  "id": 1,
  "names": ["MaliciousMod.dll", "AnotherName.dll"],
  "stolen_mod": "Original mod that was copied/modified (optional)",
  "stolen_mod_link": "Link to the original mod (optional)",
  "date": "YYYY-MM-DD",
  "type": "Type of threat (e.g., Backdoor, RAT, Cryptominer)",
  "source": "Where it was found (e.g., NexusMods, Discord)",
  "severity": "Critical | High | Medium | Low",
  "description": "Detailed description of the threat",
  "techniques": ["Technique 1", "Technique 2", "Technique 3"],
  "hash": "File hash for identification",
  "vt_link": "VirusTotal link (optional)"
}
```

#### Field Descriptions

- `id`: A unique identifier for the threat
- `names`: Array of names/filenames the malicious mod is known by
- `stolen_mod`: (Optional) Name of the legitimate mod that was stolen/modified
- `stolen_mod_link`: (Optional) Link to the original legitimate mod
- `date`: The date the threat was detected (YYYY-MM-DD format)
- `type`: The type of threat (e.g., RAT, Backdoor, Cryptominer, Info Stealer)
- `source`: Where the threat was found (e.g., NexusMods, Discord Link)
- `severity`: The severity of the threat (Critical, High, Medium, or Low)
- `description`: A detailed description of what the threat does
- `techniques`: An array of techniques used by the threat
- `hash`: The file hash for identification
- `vt_link`: (Optional) Link to VirusTotal analysis

### Adding a New Threat

To add a new threat to the database:

1. Open the `public/data/threats.json` file
2. Add a new entry at the beginning of the array with a unique ID
3. Make sure to include all required fields with appropriate values
4. Commit your changes

### Example Pull Request Description

When submitting a pull request to update the database, please include:

- Description of the threat(s) being added
- Source/evidence of the threat
- Any additional context that might be helpful

## Deployment

The website is deployed to GitHub Pages automatically whenever changes are pushed to the main branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details.