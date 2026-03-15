# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

We take the security of FlowState seriously. If you discover a security vulnerability, please follow responsible disclosure practices.

### How to Report

1. **Email**: Send a detailed report to **security@flowstate.app**
2. **Subject**: Use the format `[SECURITY] Brief description of the vulnerability`
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We will acknowledge your report within **48 hours**
- **Assessment**: We will assess the vulnerability and determine its severity within **5 business days**
- **Resolution**: Critical vulnerabilities will be patched within **7 days**; others within **30 days**
- **Disclosure**: We will coordinate with you on public disclosure timing

### Responsible Disclosure

- Please **do not** publicly disclose the vulnerability until we have had a chance to address it
- Please **do not** exploit the vulnerability beyond what is necessary to demonstrate it
- Please **do not** access or modify other users' data

### Scope

Since FlowState is a client-side application that stores data in `localStorage`, the primary security concerns include:

- Cross-Site Scripting (XSS) vulnerabilities
- Data injection through malicious input
- Third-party dependency vulnerabilities
- Content Security Policy bypasses

### Out of Scope

- Vulnerabilities in browsers themselves
- Social engineering attacks
- Physical access attacks

## Security Best Practices for Users

- Always use FlowState over HTTPS in production
- Keep your browser up to date
- Be cautious when importing data from untrusted sources

---

Thank you for helping keep FlowState and its users safe.
