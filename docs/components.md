# ChronoPapers Component Documentation

## Overview
This document provides detailed information about the React components used in ChronoPapers, their props, usage examples, and styling guidelines.

## Component Architecture

### UI Components (`components/ui/index.tsx`)

#### Card
A flexible container component with optional hover effects.

```tsx
<Card hover className="p-6">
  <h3>Paper Title</h3>
  <p>Abstract content...</p>
</Card>
```

**Props:**
- `children`: ReactNode - Content to display
- `className?`: string - Additional CSS classes
- `hover?`: boolean - Enable hover animations
- `onClick?`: () => void - Click handler

#### Button
Styled button component with multiple variants and sizes.

```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Upload Paper
</Button>
```

**Props:**
- `children`: ReactNode - Button content
- `variant?`: 'primary' | 'secondary' | 'outline' - Button style
- `size?`: 'sm' | 'md' | 'lg' - Button size
- `className?`: string - Additional CSS classes
- `onClick?`: () => void - Click handler
- `disabled?`: boolean - Disable button
- `type?`: 'button' | 'submit' | 'reset' - Button type

#### Input
Form input component with label and error handling.

```tsx
<Input
  label="Title"
  placeholder="Enter paper title"
  value={title}
  onChange={setTitle}
  required
  error={errors.title}
/>
```

**Props:**
- `label?`: string - Input label
- `placeholder?`: string - Placeholder text
- `value?`: string - Input value
- `onChange?`: (value: string) => void - Change handler
- `type?`: string - Input type
- `required?`: boolean - Required field
- `className?`: string - Additional CSS classes
- `error?`: string - Error message

#### Textarea
Multi-line text input component.

```tsx
<Textarea
  label="Abstract"
  placeholder="Enter paper abstract"
  value={abstract}
  onChange={setAbstract}
  rows={6}
  required
/>
```

**Props:**
- `label?`: string - Textarea label
- `placeholder?`: string - Placeholder text
- `value?`: string - Textarea value
- `onChange?`: (value: string) => void - Change handler
- `required?`: boolean - Required field
- `className?`: string - Additional CSS classes
- `rows?`: number - Number of rows
- `error?`: string - Error message

### Layout Components (`components/layout/index.tsx`)

#### PageContainer
Main page wrapper with animations and background.

```tsx
<PageContainer className="max-w-4xl mx-auto">
  <Header title="Upload Paper" subtitle="Preserve your research" />
  {/* Page content */}
</PageContainer>
```

#### Header
Page header with title and optional subtitle.

```tsx
<Header
  title="Browse Papers"
  subtitle="Discover research preserved on Filecoin"
/>
```

#### Section
Content section with optional title.

```tsx
<Section title="Search Results">
  <Grid cols={3}>
    {/* Paper cards */}
  </Grid>
</Section>
```

#### Grid
Responsive grid layout component.

```tsx
<Grid cols={3} gap="lg">
  {papers.map(paper => <PaperCard key={paper.id} paper={paper} />)}
</Grid>
```

### Navigation Components (`components/navigation/index.tsx`)

#### Navigation
Main navigation bar with tab switching.

```tsx
<Navigation
  activeTab="browse"
  onTabChange={setActiveTab}
/>
```

#### WalletButton
Wallet connection component.

```tsx
<WalletButton
  isConnected={walletConnected}
  address={walletAddress}
  onConnect={handleConnect}
  onDisconnect={handleDisconnect}
/>
```

### Feature Components

#### FileUpload (`components/upload/FileUpload.tsx`)
Complete file upload interface with drag-and-drop support.

```tsx
<FileUpload
  onUpload={handleUpload}
  isUploading={isUploading}
/>
```

**Props:**
- `onUpload`: (file: File, metadata: UploadMetadata) => Promise<void>
- `isUploading?`: boolean - Upload state

#### SearchPage (`components/search/SearchPage.tsx`)
Search and browse interface for research papers.

```tsx
<SearchPage
  papers={papers}
  onSearch={handleSearch}
  onViewPaper={handleViewPaper}
  onDownloadPaper={handleDownloadPaper}
  onVerifyPaper={handleVerifyPaper}
  isLoading={isLoading}
/>
```

#### PaperDetail (`components/paper/PaperDetail.tsx`)
Detailed paper view with metadata and actions.

```tsx
<PaperDetail
  paper={selectedPaper}
  onBack={() => setActiveTab('browse')}
  onDownload={handleDownloadPaper}
  onVerify={handleVerifyPaper}
  isVerifying={isVerifying}
/>
```

## Styling Guidelines

### Color System
- **Primary**: Blue gradient (#0ea5e9 → #8b5cf6)
- **Background**: Subtle gray gradient
- **Cards**: White with soft shadows
- **Text**: Gray scale hierarchy

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Code**: Monospace for CIDs

### Spacing
- Use Tailwind's spacing scale (4, 6, 8, 12, 16, 24, 32)
- Maintain consistent padding/margins across components
- Use responsive spacing (sm:, md:, lg:)

### Animations
- Use Framer Motion for smooth transitions
- Hover effects: scale(1.05) and translateY(-4px)
- Page transitions: opacity and y-axis movement
- Duration: 200-300ms for micro-interactions

### Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Use semantic HTML elements

## Best Practices

1. **Component Composition**: Build complex UIs by combining simple components
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Error Handling**: Include error states and loading states
4. **Responsive Design**: Use Tailwind's responsive utilities
5. **Performance**: Use React.memo for expensive components
6. **Testing**: Write unit tests for complex logic

## Customization

### Adding New Components
1. Create component file in appropriate directory
2. Export from index.tsx
3. Add TypeScript interfaces
4. Include proper styling and animations
5. Update documentation

### Modifying Styles
1. Use Tailwind utility classes
2. Add custom CSS in globals.css for complex styles
3. Maintain design system consistency
4. Test across different screen sizes

### Extending Functionality
1. Follow existing patterns
2. Maintain backward compatibility
3. Add proper error handling
4. Update TypeScript interfaces
5. Test thoroughly
