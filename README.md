# ChronoPapers  
**Preserving knowledge forever with decentralized, tamper-proof archives.**

---

## Overview  
ChronoPapers is a decentralized archive for academic research, built on **Filecoin Onchain Cloud**.  
It allows researchers to **upload, timestamp, and preserve** their papers permanently while ensuring authenticity through **verifiable storage proofs**. Each paper gets a unique **CID** (Content Identifier), and versioning ensures transparency for updates or corrections.  

---

## ✨ Features  
- **Decentralized Storage** – Papers stored securely on Filecoin/IPFS.  
- **Tamper-Proof** – Verifiable via cryptographic proofs (PDP).  
- **Timestamped & Immutable** – Each paper is time-anchored and linked to previous versions.  
- **Search & Browse** – Query by title, author, or CID.  
- **Version Control** – Track revisions while preserving the original work.  
- **Modern UI** – Clean, academic aesthetic with smooth animations

---

## 🛠️ Tech Stack  
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Storage**: Filecoin (Synapse SDK / WarmStorage API)
- **Wallet Auth**: Web3Auth / Metamask
- **UI Components**: Lucide React icons, custom components

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChronoPapers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔗 Wallet Setup

### Automatic Network Configuration
ChronoPapers automatically attempts to connect to the **Filecoin Calibration testnet** when you connect your wallet. However, if the automatic network switching fails, you can manually add the network to MetaMask.

### Manual Network Setup (MetaMask)

If the automatic network switching doesn't work, follow these steps to manually add the Filecoin Calibration testnet:

1. **Open MetaMask**
   - Click on the MetaMask extension icon in your browser

2. **Access Network Settings**
   - Click on your account icon in the top right corner
   - Select "Settings" from the dropdown menu
   - Click on "Networks" in the left sidebar

3. **Add Custom Network**
   - Click "Add Network" button
   - Choose "Add a network manually"

4. **Enter Network Details**
   Use these exact parameters:
   ```
   Network Name: Filecoin Calibration
   RPC URL: https://api.calibration.node.glif.io/rpc/v1
   Chain ID: 314159
   Currency Symbol: tFIL
   Block Explorer URL: https://calibration.filfox.info
   ```

5. **Save and Switch**
   - Click "Save" to add the network
   - MetaMask will automatically switch to the new network

### Getting Test Tokens
Once connected to Filecoin Calibration testnet:
- Visit the [Filecoin Calibration Faucet](https://faucet.calibration.fildev.network/)
- Enter your wallet address to receive test FIL (tFIL) tokens
- Use these tokens for testing uploads and transactions

### Troubleshooting
- **Network not switching**: Try refreshing the page after adding the network manually
- **Connection errors**: Ensure you're using the correct RPC URL and Chain ID
- **Transaction failures**: Make sure you have sufficient tFIL tokens for gas fees

---

## 📱 Application Structure

### Pages & Components
- **Upload Page** (`/`) - Drag-and-drop file upload with metadata form
- **Browse Page** (`/browse`) - Search and filter research papers
- **Paper Detail** (`/papers/[id]`) - Detailed paper view with verification
- **Navigation** - Tab-based navigation with wallet connection

### API Routes
- `POST /api/papers` - Upload new research paper
- `GET /api/papers` - Search and retrieve papers
- `GET /api/papers/[id]` - Get specific paper details
- `POST /api/papers/[id]/verify` - Verify paper integrity (PDP)
- `GET /api/papers/[id]/download` - Download paper file

### Database Schema
- **ResearchPaper** - Core paper metadata and Filecoin CID
- **PDPProof** - Verification proofs and timestamps
- **User** - Wallet addresses and user data

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#0ea5e9 → #8b5cf6)
- **Background**: Subtle gray gradient
- **Cards**: White with soft shadows
- **Text**: Gray scale for hierarchy

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Code**: Monospace for CIDs

### Components
- **Cards**: Rounded corners with soft shadows
- **Buttons**: Gradient primary, secondary, outline variants
- **Forms**: Clean inputs with focus states
- **Animations**: Framer Motion for smooth transitions

---

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema changes
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
```

### Environment Variables
Create a `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_WALLET_PROJECT_ID="your-web3auth-project-id"
```

---

## 🏗️ Architecture  

### Upload Flow
1. **Researcher Uploads Paper** → File + metadata sent to Filecoin/IPFS
2. **CID Generated** → Unique content identifier stored in database
3. **Metadata Stored** → Paper details saved with Prisma
4. **Verification Ready** → Paper available for PDP verification

### Verification Flow
1. **User Requests Verification** → PDP proof generation triggered
2. **File Integrity Check** → Cryptographic verification on Filecoin
3. **Proof Validation** → Verification result stored and displayed
4. **Global Access** → Anyone can verify file integrity

### Search & Retrieval
1. **Search Query** → Database filtered by title, author, keywords
2. **Results Displayed** → Clean card layout with metadata
3. **File Download** → Direct retrieval from Filecoin via CID
4. **Verification Available** → One-click PDP verification

---

## 📊 Proof-of-Data-Possession (PDP)

See [PDP Flow Documentation](./docs/pdp-flow.md) for detailed verification process.

**Key Benefits:**
- **Tamper-Proof**: Cryptographic proofs prevent data modification
- **Efficient**: Verification without full file download  
- **Decentralized**: No single point of failure
- **Transparent**: Anyone can verify file integrity
- **Permanent**: Files stored permanently on Filecoin network

---

## 🔮 Roadmap  

### ✅ Completed (Wave 1)
- [x] Modern UI/UX with academic aesthetic
- [x] TypeScript data models and interfaces
- [x] Upload page with drag-and-drop
- [x] Search and browse functionality
- [x] Paper detail pages
- [x] API routes for CRUD operations
- [x] Mock PDP verification system
- [x] Responsive design with animations

### 🚧 In Progress (Wave 2)
- [ ] Real Filecoin storage integration
- [ ] Web3Auth wallet connection
- [ ] Actual PDP verification implementation
- [ ] File upload progress tracking
- [ ] Advanced search filters

### 📋 Planned (Wave 3)
- [ ] Author profiles and authentication
- [ ] Citation management system
- [ ] Version control UI
- [ ] Batch upload functionality
- [ ] Export/import features

### 🎯 Future (Wave 4)
- [ ] Full Filecoin Onchain Cloud integration
- [ ] Smart contract integration
- [ ] Decentralized governance
- [ ] Mobile app development
- [ ] API for third-party integrations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License  
MIT License © 2025 ChronoPapers Team

---

## 🔗 Links
- [Notion Documentation](https://secret-blackberry-bc2.notion.site/ChronoPapers-263412aee10c80ad88dce2a137c46296)
- [Project Deck](https://drive.google.com/file/d/1FLJFNDDguZP1Cks1JEfgJxgtQycIKbgk/view?usp=sharing)
- [Filecoin Documentation](https://docs.filecoin.io/)
- [Synapse SDK](https://github.com/FilOzone/synapse-sdk)
