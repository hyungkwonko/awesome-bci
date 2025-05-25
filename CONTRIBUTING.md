# Contributing Guidelines: Adding New Papers

Thank you for your interest in contributing to the Awesome Brain-Computer Interface repository! This guide will walk you through the process of adding new research papers to our collection.

## Prerequisites

Before you begin, make sure you have:
- A GitHub account
- Basic familiarity with Git and GitHub
- The paper you want to add (with all required information)

## Step-by-Step Guide

### 1. Fork and Clone the Repository

1. Fork this repository by clicking the "Fork" button on GitHub
2. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/awesome-brain-computer-interface.git
   cd awesome-brain-computer-interface
   ```

### 2. Navigate to the Papers Directory

All paper JSON files are stored in the `pages/item-papers/` directory:
```
pages/
├── item-papers/
│   ├── index.json
│   ├── paper_0001.json
│   ├── paper_0002.json
│   └── ...
```

### 3. Create a New Paper JSON File

#### 3.1 Determine the Next Paper Number

1. Check the `pages/item-papers/index.json` file to see the existing papers
2. Find the highest numbered paper file (e.g., `paper_0087.json`)
3. Create your new file with the next number (e.g., `paper_0088.json`)

#### 3.2 Create the JSON File

Create a new file named `paper_XXXX.json` (where XXXX is your four-digit number) in the `pages/item-papers/` directory with the following structure:

```json
{
  "title": "Your Paper Title Here",
  "authors": [
    "First Author Name",
    "Second Author Name",
    "Third Author Name", ...
  ],
  "year": 20XX,
  "publication": "Journal Name or Conference Name",
  "abstract": "Brief abstract or description of the paper (optional but recommended)",
  "keywords": [
    "keyword1",
    "keyword2",
    "keyword3",
    "keyword4",
    "keyword5"
  ],
  "doi": "10.1000/example-doi",
  "pdf": "https://example.com/paper.pdf",
  "code": "https://github.com/example/code-repo",
  "bibtex": "@article{firstauthor2024,\n  title={Your Paper Title Here},\n  author={First Author Name and Second Author Name},\n  journal={Journal Name},\n  volume={XX},\n  pages={XX-XX},\n  doi={10.1000/example-doi},\n  year={20XX},\n  publisher={Publisher Name}\n}",
  "citations": 0,
  "added_date": "2024-12-01",
  "volume": "XX",
  "pages": "XX-XX",
  "url": "https://example.com/paper-url"
}
```

### 4. Field Guidelines

#### Required Fields
- **title**: The full title of the paper
- **authors**: Array of author names (use the format as published)
- **year**: Publication year
- **publication**: Journal or conference name
- **url**: Official paper URL
- **added_date**: Date you're adding the paper (YYYY-MM-DD format)

#### Optional Fields
- **pdf**: Direct link to PDF (if publicly available)
- **abstract**: Brief description (recommended for better searchability)
- **keywords**: 3-7 relevant keywords extracted from title/abstract
- **doi**: Digital Object Identifier (if available)
- **code**: Link to associated code repository
- **bibtex**: Properly formatted BibTeX citation
- **citations**: Citation count (can be left as 0)
- **volume**: Journal volume number
- **pages**: Page range

#### Field Format Guidelines

**Authors**: Use the exact format as published in the paper
```json
"authors": ["Smith, J.", "Doe, A.", "Johnson, M."]
```

**Keywords**: Extract 3-7 relevant terms from the title and abstract
```json
"keywords": ["brain-computer interface", "machine learning", "EEG", "motor imagery"]
```

**BibTeX**: Use proper formatting with line breaks
```json
"bibtex": "@article{smith2024,\n  title={Paper Title},\n  author={Smith, J. and Doe, A.},\n  journal={Journal Name},\n  year={2024}\n}"
```

**DOI**: Include the DOI without the `https://doi.org/` prefix
```json
"doi": "10.1038/s41467-024-12345-6"
```

### 5. Update the Index File

After creating your paper JSON file, you need to update the `pages/item-papers/index.json` file:

1. Open `pages/item-papers/index.json`
2. Add your new filename to the array in alphabetical/numerical order:
   ```json
   [
     "paper_0001.json",
     "paper_0002.json",
     "paper_0003.json",
     "paper_0088.json"
   ]
   ```

### 6. Validate Your JSON

Before submitting, make sure your JSON is valid:
- Use a JSON validator tool
- Check that all required commas are present
- Ensure proper quote formatting
- Verify no trailing commas

### 7. Test Locally (Optional)

If you want to test your changes locally:
1. Open the `pages/papers.html` file in a web browser
2. Check that your paper appears in the list
3. Verify all links work correctly

### 8. Commit and Submit

1. Create a new branch for your contribution:
   ```bash
   git checkout -b add-paper-XXXX
   ```

2. Add your changes:
   ```bash
   git add pages/item-papers/paper_XXXX.json
   git add pages/item-papers/index.json
   ```

3. Commit with a descriptive message:
   ```bash
   git commit -m "Add paper: [Paper Title Here]"
   ```

4. Push to your fork:
   ```bash
   git push origin add-paper-XXXX
   ```

5. Create a Pull Request on GitHub with:
   - Clear title: "Add paper: [Paper Title]"
   - Description including paper details
   - Reference to any related issues

## Quality Guidelines

### Paper Relevance
Papers should be related to:
- Brain-Computer Interfaces (BCIs)
- Neural signal processing
- EEG, fMRI, or other brain imaging for BCI
- Machine learning for neural data
- Neurofeedback systems
- Assistive technologies using brain signals

### Paper Quality
- Peer-reviewed publications preferred
- Conference papers from reputable venues accepted
- Preprints accepted if significant contribution
- Avoid duplicate submissions

### Information Accuracy
- Double-check all URLs and DOIs
- Verify author names and publication details
- Ensure BibTeX formatting is correct
- Test PDF links before submission

## Common Issues and Solutions

### URL Issues
- Always test URLs before submitting to ensure they work
Use the official publisher URL when possible (e.g., Nature, IEEE, ACM)
- If the paper is behind a paywall, link to the official page anyway
- For open access papers, link directly to the full-text version
- Avoid using URL shorteners - use full, permanent URLs
- If the original URL is broken, try finding the paper on:
  - Publisher's website
  - Author's institutional page
  - Research repositories (ResearchGate, Academia.edu)
  - Preprint servers (arXiv, bioRxiv)

### DOI Not Working
- Check if the DOI is formatted correctly
- Some papers may not have DOIs (leave as empty string)

### PDF Not Publicly Available
- Link to the official publisher page instead
- Use preprint versions if available (arXiv, bioRxiv)
- Leave empty if no public access

### BibTeX Formatting
- Use proper escape characters for special symbols
- Include line breaks with `\n`
- Follow standard BibTeX format

### Author Name Formatting
- Use the exact format from the paper
- Include middle initials if provided
- Maintain consistent formatting within the entry

## Review Process

1. **Automated Checks**: Your PR will be automatically checked for JSON validity
2. **Manual Review**: Maintainers will verify paper relevance and information accuracy
3. **Feedback**: You may receive requests for changes or corrections
4. **Merge**: Once approved, your contribution will be merged into the main repository

## Questions or Issues?

If you encounter any problems or have questions:
- Open an issue on GitHub
- Check existing issues for similar problems
- Contact maintainers through GitHub discussions

Thank you for contributing to the Awesome Brain-Computer Interface collection! Your contributions help build a valuable resource for the BCI research community.