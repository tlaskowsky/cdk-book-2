# 📘 Building MagicMail: Managing Infrastructure with CI/CD  
**AWS CDK, TypeScript, Git, and GitLab CI/CD**

This repository contains the complete source code for the book:

**AWS CDK Made Easy!**  
**Book 2: Build and Deploy CI/CD Pipelines with Git and GitLab® to AWS**  
*by Terumi Laskowsky*

The code in this repository mirrors the structure of the book and is organized to follow the progression of building a professional, automated infrastructure management system using Git, GitLab, and AWS CDK.

---

## 📁 Structure

- `magicmail-infra/` – Main infrastructure project for the MagicMail platform
- `.gitlab-ci.yml` – CI/CD pipeline configuration developed and enhanced step-by-step through the book
- Additional configuration and setup scripts as needed

---

## 📚 Viewing Code at Specific Chapter Milestones

Each major milestone in the book is **tagged** in this repository.  
To view the code as it existed at the end of each chapter:

1. Clone the repository:
   ```bash
   git clone https://github.com/tlaskowsky/cdk-book-2.git
   cd cdk-book-2
   ```

2. List available tags:
   ```bash
   git tag
   ```

3. Checkout the tag corresponding to the chapter:
   ```bash
   git checkout <tag-name>
   ```

| Chapter | Tag Name            | Description                                        |
|:-------:|:--------------------|:--------------------------------------------------|
| 1       | `chapter-1-end`      | Initial Git setup for MagicMail project            |
| 2       | `chapter-2-end`      | GitLab server deployed using CDK                  |
| 3       | `chapter-3-end`      | Managing code with GitLab Issues and Merge Requests |
| 4       | `chapter-4-end`      | Introduction to CI/CD concepts and GitLab pipelines |
| 5       | `chapter-5-end`      | First working CDK validation pipeline             |
| 6       | `chapter-6-end`      | Full end-to-end CI/CD pipeline with manual deployment gate |

**Example:** To view the project as it was at the end of Chapter 3:
```bash
git checkout chapter-3-end
```

To return to the latest version:
```bash
git checkout main
```

---

## ⚡️ Quick Highlights

- Git basics and project version control
- Setting up and using GitLab for collaboration
- Deploying a self-hosted GitLab server on AWS
- Building GitLab CI/CD pipelines from scratch
- Automating CDK validation, diffing, and deployment
- Securing AWS credentials for pipelines

---

## 📚 Related Work

If you're new to the series or want a refresher, the code for Book 1 is available here:

> [GitHub - tlaskowsky/cdk-book-1](https://github.com/tlaskowsky/cdk-book-1)

Book 1 covers foundational topics like AWS CDK, TypeScript, and basic Git workflows, and sets the stage for the CI/CD pipelines built in Book 2.

## 📚 Continue Your Journey

Want to read the book?

- 📘 **Book 1** (*AWS CDK Made Easy! Build Cloud Infrastructure with TypeScript and CDK*)  
  [Available on Kindle →](https://a.co/d/a25mc8O)

- 📗 **Book 2** (*AWS CDK Made Easy! Build and Deploy CI/CD Pipelines with Git and GitLab® to AWS*)  
  [Available on Kindle →](https://a.co/d/btQTnNn)

- 📚 **MagicMail AWS CDK Series (Full Series Page)**  
  [View the Series on Amazon →](https://www.amazon.com/dp/B0F5LCMFSG?binding=kindle_edition&ref=dbs_dp_rwt_sb_pc_tkin)


---

## © 2025 Terumi Laskowsky

All rights reserved. This code is intended for educational use alongside the book.
