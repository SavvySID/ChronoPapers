# Proof-of-Data-Possession (PDP) Flow Diagram

```mermaid
graph TD
    A[Researcher Uploads Paper] --> B[File Stored on Filecoin]
    B --> C[CID Generated]
    C --> D[Metadata Stored in Database]
    D --> E[Paper Available for Retrieval]
    
    E --> F[User Requests Paper]
    F --> G[Retrieve File via CID]
    G --> H[Generate PDP Proof]
    H --> I{Proof Valid?}
    
    I -->|Yes| J[File Integrity Confirmed]
    I -->|No| K[File May Be Corrupted/Missing]
    
    J --> L[User Downloads Verified File]
    K --> M[Verification Failed Alert]
    
    N[Anyone Can Verify] --> O[Request PDP Proof]
    O --> P[Check File Existence]
    P --> Q[Verify Cryptographic Proof]
    Q --> R[Return Verification Result]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f1f8e9
    style J fill:#e8f5e8
    style K fill:#ffebee
    style L fill:#e8f5e8
    style M fill:#ffebee
```

## PDP Verification Process

1. **Upload Phase**: Researcher uploads paper to Filecoin network
2. **Storage Phase**: File is distributed across multiple nodes with CID generated
3. **Retrieval Phase**: Users can download files using the CID
4. **Verification Phase**: Anyone can verify file integrity without downloading the entire file
5. **Proof Generation**: Cryptographic proofs ensure data hasn't been tampered with
6. **Global Verification**: Decentralized verification ensures transparency and trust

## Key Benefits

- **Tamper-Proof**: Cryptographic proofs prevent data modification
- **Efficient**: Verification without full file download
- **Decentralized**: No single point of failure
- **Transparent**: Anyone can verify file integrity
- **Permanent**: Files stored permanently on Filecoin network
