# 🤝 Contributors Guide

Welcome to the Study Notes Hub project! This guide will help you set up the project locally, understand how it works, and contribute effectively.

## 📋 Table of Contents

- [Quick Setup](#-quick-setup)
- [Project Architecture](#-project-architecture)
- [Adding New Subjects](#-adding-new-subjects)
- [Managing Notes](#-managing-notes)
- [Local Development Configuration](#-local-development-configuration)
- [Development Workflow](#-development-workflow)
- [File Structure](#-file-structure)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Setup

### Prerequisites

- **Node.js** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Installation Steps

1. **Fork and Clone the repository**:
   ```bash
   git clone https://github.com/your-username/study-notes-hub.git
   cd study-notes-hub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

That's it! The application should now be running locally.

## 🏗️ Project Architecture

### Core Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **PDF.js** - PDF rendering (via Mozilla's hosted viewer)

### How It Works

The application is structured as a single-page React application with the following key components:

1. **Subject Management**: All subjects are defined in `src/components/study-notes-hub.jsx` in the `studyTopicsData` array
2. **PDF Storage**: Notes are stored as PDF files in the `public/pdfs/` directory
3. **PDF Serving**: In production, PDFs are served via GitHub's raw content URLs
4. **Progress Tracking**: User progress is stored in browser's localStorage
5. **Responsive Design**: Mobile-first approach with swipe gestures on mobile devices

### Key Files

- `src/components/study-notes-hub.jsx` - Main component containing subject definitions
- `src/components/subject-page.jsx` - Individual subject view with PDF rendering
- `public/pdfs/` - Regular notes storage
- `public/pdfs/hwn/` - Handwritten notes storage

## 📚 Adding New Subjects

### Step 1: Add Subject Definition

Edit `src/components/study-notes-hub.jsx` and add your new subject to the `studyTopicsData` array:

```javascript
{
  title: "Your Subject Name",
  file: "subject-code", // Short identifier (e.g., "os", "dbms")
  image: "https://images.pexels.com/photos/your-image-url", // Pexels image URL
  semesters: [1, 2], // Array of available semesters
  semester2Title: "Optional Different Title for Semester 2" // Optional
}
```

### Step 2: Prepare PDF Files

Your PDF files must follow this naming convention:
- Regular notes: `{subject-code}-s{semester}.pdf`
- Handwritten notes: `{subject-code}-s{semester}.pdf`

**Examples**:
- `os-s1.pdf` (Operating System semester 1 regular notes)
- `dbms-s2.pdf` (Database Management System semester 2 regular notes)

### Step 3: Add PDF Files

Place your PDF files in the appropriate directories:
- **Regular notes**: `public/pdfs/`
- **Handwritten notes**: `public/pdfs/hwn/`

### Subject Configuration Options

```javascript
{
  title: "Operating System",     // Display name
  file: "os",                   // File identifier (must be unique)
  image: "image-url",           // Thumbnail image
  semesters: [1, 2],           // Available semesters
  semester2Title: "Advanced OS" // Optional different title for semester 2
}
```

## 📁 Managing Notes

### File Naming Convention

The application expects PDF files to follow this strict naming pattern:

```
{subject.file}-s{semester}.pdf
```

Where:
- `{subject.file}` is the `file` property from your subject definition
- `{semester}` is the semester number (1 or 2)

### Directory Structure

```
public/
└── pdfs/
    ├── os-s1.pdf          # Operating System Semester 1
    ├── os-s2.pdf          # Operating System Semester 2
    ├── dbms-s1.pdf        # Database Management Semester 1
    └── hwn/               # Handwritten notes
        ├── os-s1.pdf      # OS Semester 1 handwritten
        ├── os-s2.pdf      # OS Semester 2 handwritten
        └── dbms-s1.pdf    # DBMS Semester 1 handwritten
```

### File Size Considerations

- Keep PDF files optimized (ideally under 10MB)
- Use PDF compression tools if needed
- Consider splitting very large documents

## ⚙️ Local Development Configuration

### Important: GitHub URLs vs Local Development

**Production Behavior**: The app fetches PDFs from GitHub using raw URLs:
```
https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/os-s1.pdf
```

**For Local Development**, you have two options:

#### Option 1: Use Local Files (Recommended)

Create a development configuration by modifying the PDF sources in `src/components/subject-page.jsx`:

```javascript
// Replace the pdfSources object with local paths for development
const pdfSources = {
  semester1: {
    notes: `/pdfs/${subject.file.toLowerCase()}-s1.pdf`,
    handwritten: `/pdfs/hwn/${subject.file.toLowerCase()}-s1.pdf`,
  },
  semester2: {
    notes: `/pdfs/${subject.file.toLowerCase()}-s2.pdf`,
    handwritten: `/pdfs/hwn/${subject.file.toLowerCase()}-s2.pdf`,
  },
};
```

#### Option 2: Environment-Based Configuration

Create a `.env` file in the project root:

```env
VITE_PDF_BASE_URL=http://localhost:5173
VITE_GITHUB_REPO_URL=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main
```

Then modify the PDF sources to use environment variables:

```javascript
const baseUrl = import.meta.env.DEV 
  ? import.meta.env.VITE_PDF_BASE_URL 
  : import.meta.env.VITE_GITHUB_REPO_URL;

const pdfSources = {
  semester1: {
    notes: `${baseUrl}/public/pdfs/${subject.file.toLowerCase()}-s1.pdf`,
    // ... rest of the configuration
  }
};
```

### Development vs Production

| Environment | PDF Source | Configuration |
|-------------|------------|---------------|
| Development | Local files (`/pdfs/`) | Vite dev server |
| Production | GitHub raw URLs | Static hosting |

## 🔄 Development Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Add subjects to `studyTopicsData`
   - Add PDF files to appropriate directories
   - Test locally

3. **Test your changes**:
   ```bash
   npm run dev
   ```

4. **Build for production** (optional):
   ```bash
   npm run build
   npm run preview
   ```

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add new subject XYZ"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Before Submitting a PR

- [ ] Test all new subjects load correctly
- [ ] Verify PDF files are accessible
- [ ] Check responsive design on mobile
- [ ] Ensure no console errors
- [ ] Update documentation if needed

## 📂 File Structure

```
study-notes-hub/
├── public/
│   ├── pdfs/                 # Regular notes
│   │   ├── os-s1.pdf
│   │   ├── dbms-s2.pdf
│   │   └── ...
│   └── pdfs/hwn/            # Handwritten notes
│       ├── os-s1.pdf
│       └── ...
├── src/
│   ├── components/
│   │   ├── study-notes-hub.jsx    # Main component (subjects defined here)
│   │   ├── subject-page.jsx       # Subject view (PDF URLs configured here)
│   │   ├── homePage/              # Home page components
│   │   ├── notesPage/             # PDF viewer components
│   │   └── ui/                    # Reusable UI components
│   ├── lib/                       # Utility functions
│   └── App.jsx                    # Root component
├── package.json
├── vite.config.js
└── README.md
```

## 🐛 Troubleshooting

### Common Issues

#### PDFs Not Loading
- **Check file names**: Ensure they follow the exact naming convention
- **Check file paths**: Verify files are in the correct directories
- **Check network**: In production, verify GitHub URLs are accessible

#### Subject Not Appearing
- **Check subject definition**: Ensure it's added to `studyTopicsData` array
- **Check syntax**: Verify no JSON syntax errors in the subject object
- **Check browser console**: Look for JavaScript errors

#### Development Server Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm run dev
```

#### Build Issues
```bash
# Check for linting errors
npm run lint

# Build with verbose output
npm run build -- --debug
```

### Getting Help

1. **Check existing issues** on GitHub
2. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
3. **Join discussions** in the repository

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

## 🎯 Best Practices

### Code Style
- Use meaningful component and variable names
- Follow React hooks best practices
- Keep components focused and reusable
- Use TypeScript for type safety (when applicable)

### PDF Management
- Optimize PDF file sizes before adding
- Use descriptive but consistent naming
- Test PDFs in both desktop and mobile views
- Ensure PDFs are accessible and readable

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits focused on single changes
- Use feature branches for new subjects/features
- Update documentation with significant changes

---

Happy contributing! 🚀 If you have any questions, feel free to open an issue or reach out to the maintainers.