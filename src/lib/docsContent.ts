export interface FlowStep {
  stepNumber: number;
  action: string;
  navigation: string;
  fieldsToValidate: string[];
  tip?: string;
}

export interface SampleFlow {
  id: string;
  title: string;
  module: string;
  description: string;
  steps: FlowStep[];
  commonPitfalls: string[];
  expectedOutcome: string;
}

export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: string;
}

// ---------------------------------------------------------------------------
// User Guide
// ---------------------------------------------------------------------------

export const userGuide: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    content: `Welcome to the **D365 UAT Coach** — your AI-powered companion for User Acceptance Testing in Microsoft Dynamics 365 Finance & Operations.

**What this tool does:**
- Answers your D365FO finance questions in plain, friendly language
- Quizzes you on module knowledge so you feel confident before testing
- Helps you triage defects — is it a real bug, a configuration issue, or a training gap?
- Lets you upload your project documents (FDD, test scripts) so guidance is tailored to YOUR project

**How to get started:**
1. Choose a mode from the sidebar — Coach, Quiz, Triage, Upload, or Docs.
2. If you have project documents (FDD, test scripts, or process docs), upload them first via the **Upload** tab. This lets the AI give you project-specific answers instead of generic ones.
3. Head to **Coach** mode and ask your first question — e.g. "How do I post a vendor invoice?"

**No account required.** Your chat history lives in your browser. Nothing is stored on a server.`,
  },
  {
    id: 'coach-mode',
    title: 'Coach Mode',
    icon: '💬',
    content: `**Coach Mode** is a conversational AI assistant that answers your D365FO finance questions.

**Best for:**
- "How do I…?" questions — e.g. "How do I reverse a posted journal?"
- Navigation help — "Where do I find the aging report?"
- Understanding system behaviour — "Why won't my invoice post?"
- Comparing D365 to your old system — "In our legacy system we did X — how does that work here?"

**Tips for better answers:**
- Be specific: "I'm trying to post an AP invoice and getting error X" beats "invoices don't work."
- Mention the module if it's not obvious: "In Fixed Assets, how do I…"
- If you uploaded project documents, the Coach will use them automatically — no need to re-paste your FDD.

**Limitations:**
- The Coach gives guidance, not guarantees. Always validate with your project team.
- It cannot access your live D365 environment — it can't look up your actual data.`,
  },
  {
    id: 'quiz-mode',
    title: 'Quiz Mode',
    icon: '📝',
    content: `**Quiz Mode** tests your readiness for UAT with 5 multiple-choice questions on a module you choose.

**How it works:**
1. Select a D365FO finance module (e.g. Accounts Payable).
2. Click **Start Quiz** — the AI generates 5 questions tailored to practical UAT knowledge.
3. Answer each question. You'll see immediate feedback with explanations.
4. At the end, review your score and any knowledge gaps.

**What it tests:**
- Navigation: Can you find the right forms and buttons?
- Process flow: Do you know the correct order of steps?
- Validation: Do you know what the system checks before posting?
- Error handling: Do you know what common errors mean?

**Your quiz history** is saved locally in your browser. You can retake quizzes as many times as you like to build confidence.

**Pro tip:** If you uploaded project documents, quiz questions will be tailored to your project configuration rather than generic D365FO.`,
  },
  {
    id: 'defect-triage',
    title: 'Defect Triage',
    icon: '🔍',
    content: `**Defect Triage** helps you classify issues found during UAT before logging them as bugs.

**Why this matters:**
In a typical UAT cycle, over 60% of "bugs" are actually training gaps or configuration issues. Mis-classified tickets slow down the entire project.

**How to use it:**
1. Switch to **Triage** mode.
2. Describe the issue you encountered — be as specific as possible. Include:
   - What you were trying to do
   - What you expected to happen
   - What actually happened
   - Any error messages (exact text helps!)
3. The AI will classify it as one of:
   - **Training Issue** — You may need to adjust your approach; the system is working correctly.
   - **Configuration Issue** — The system needs a setup change, not a code fix.
   - **Genuine Defect** — A real bug that should be logged for the development team.
   - **Out of Scope** — The functionality isn't part of this project phase.

**The AI also provides:**
- A confidence level (High / Medium / Low)
- Specific reasoning for its classification
- Recommended next steps`,
  },
  {
    id: 'context-upload',
    title: 'Context Upload',
    icon: '📄',
    content: `**Context Upload** lets you add your project documents so the AI can give project-specific guidance.

**Supported formats:** PDF, DOCX, TXT

**What to upload:**
- **Functional Design Documents (FDDs)** — The AI will reference your specific configurations, business rules, and process flows.
- **Test scripts** — So the Coach can help you understand what each test step expects.
- **Process documentation** — SOPs, training materials, or process maps.

**How it works:**
1. Go to the **Upload** tab.
2. Drag and drop or browse to select your file.
3. The document text is extracted and stored in your browser session.
4. All modes (Coach, Quiz, Triage) will now use this context to tailor responses.

**Privacy:** Document content stays in your browser. It is sent to the AI model as part of your prompt but is NOT stored on any server.

**Tip:** You can upload multiple documents. To remove a document, click the ✕ button next to it in the uploaded files list.`,
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: '❓',
    content: `**Q: Is this an official Microsoft product?**
A: No. This is an AI-powered assistant built to help end-users during UAT. It is not affiliated with or endorsed by Microsoft.

**Q: Can the AI access my live D365 environment?**
A: No. The AI has no access to your D365 tenant, data, or configuration. It provides guidance based on general D365FO knowledge and any documents you upload.

**Q: Is my data secure?**
A: Your chat history and uploaded documents are stored locally in your browser. Document content is sent to the AI model for processing but is not persisted on any server.

**Q: How accurate is the AI?**
A: The AI is knowledgeable about D365FO Finance, but it can make mistakes. Always validate guidance with your project team before taking action in your live or UAT environment.

**Q: Can I use this for D365 modules outside Finance?**
A: The Coach is specialised in D365FO Finance modules (GL, AP, AR, Fixed Assets, Budgeting, Cash & Bank Management, Credit & Collections, Tax). For Supply Chain, HR, or Customer Engagement questions, please consult the appropriate module team.

**Q: My quiz score was low — should I be worried?**
A: Not at all! The quiz is a learning tool, not a test you can fail. Use the explanations to fill knowledge gaps and retake the quiz until you feel confident.

**Q: The triage classified my issue as a Training Issue — does that mean I made a mistake?**
A: Not necessarily. "Training Issue" means the system is behaving as designed, but you may need additional guidance on the correct steps. It's one of the most common outcomes and perfectly normal during UAT.`,
  },
];

// ---------------------------------------------------------------------------
// Sample UAT Flows
// ---------------------------------------------------------------------------

export const sampleFlows: SampleFlow[] = [
  // 1. Create & Post Vendor Invoice (AP)
  {
    id: 'ap-vendor-invoice',
    title: 'Create & Post Vendor Invoice',
    module: 'Accounts Payable',
    description:
      'Record a vendor invoice that is not linked to a purchase order. This flow covers creating an invoice journal, entering line details with financial dimensions, validating totals, and posting.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open the Invoice journal form',
        navigation: 'Accounts payable > Invoices > Invoice journal',
        fieldsToValidate: ['Journal name'],
        tip: 'Your project may have a specific journal name configured — check your FDD or ask your lead.',
      },
      {
        stepNumber: 2,
        action: 'Click "New" to create a new journal header',
        navigation: 'Action Pane > New',
        fieldsToValidate: ['Journal batch number', 'Journal name'],
      },
      {
        stepNumber: 3,
        action: 'Click "Lines" to open the journal lines form',
        navigation: 'Action Pane > Lines',
        fieldsToValidate: [],
      },
      {
        stepNumber: 4,
        action: 'Enter invoice line details',
        navigation: 'Journal voucher form',
        fieldsToValidate: [
          'Date',
          'Invoice account (vendor)',
          'Invoice number',
          'Credit amount',
          'Offset account type',
          'Offset account',
          'Financial dimensions',
        ],
        tip: 'The "Invoice account" is the vendor number. Start typing the vendor name to search.',
      },
      {
        stepNumber: 5,
        action: 'Validate the journal',
        navigation: 'Action Pane > Validate > Validate',
        fieldsToValidate: [],
        tip: 'Fix any validation errors before posting. Common issues: missing financial dimensions, closed period, or inactive vendor.',
      },
      {
        stepNumber: 6,
        action: 'Post the journal',
        navigation: 'Action Pane > Post',
        fieldsToValidate: ['Voucher number (generated after posting)'],
        tip: 'After posting, note the voucher number — you will need it to verify the GL impact.',
      },
    ],
    commonPitfalls: [
      'Selecting the wrong journal name — each journal name has default offset accounts and controls.',
      'Forgetting to enter the vendor\'s invoice number in the "Invoice" field — this is required for duplicate invoice checking.',
      'Missing financial dimensions — if your project requires them, the journal won\'t validate without them.',
      'Trying to post to a closed fiscal period — check with your GL team that the period is open.',
    ],
    expectedOutcome:
      'The journal posts successfully, a voucher number is generated, the vendor balance increases in the AP sub-ledger, and corresponding GL entries are created.',
  },

  // 2. 3-Way Match PO Invoice (AP)
  {
    id: 'ap-3way-match',
    title: '3-Way Match PO Invoice',
    module: 'Accounts Payable',
    description:
      'Process a vendor invoice against a purchase order using 3-way matching (PO → Product receipt → Invoice). D365 validates that quantities and prices match across all three documents before allowing posting.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open the Pending vendor invoices list',
        navigation: 'Accounts payable > Invoices > Pending vendor invoices',
        fieldsToValidate: [],
      },
      {
        stepNumber: 2,
        action: 'Click "New" and select "From purchase order"',
        navigation: 'Action Pane > New > From purchase order',
        fieldsToValidate: ['Purchase order number'],
        tip: 'You can search by PO number or vendor name.',
      },
      {
        stepNumber: 3,
        action: 'Select the purchase order and confirm',
        navigation: 'Select PO dialog',
        fieldsToValidate: ['PO number', 'Vendor account', 'Currency'],
      },
      {
        stepNumber: 4,
        action: 'Enter the vendor invoice number and verify header details',
        navigation: 'Vendor invoice form > Header view',
        fieldsToValidate: [
          'Number (vendor invoice number)',
          'Invoice date',
          'Invoice description',
        ],
      },
      {
        stepNumber: 5,
        action: 'Review line details and match to product receipts',
        navigation: 'Vendor invoice form > Lines view > Match product receipts',
        fieldsToValidate: [
          'Quantity',
          'Unit price',
          'Net amount',
          'Product receipt match',
        ],
        tip: 'In a 3-way match, the quantity on the invoice must match the product receipt quantity, and the unit price must match the PO price.',
      },
      {
        stepNumber: 6,
        action: 'Check matching status',
        navigation: 'Action Pane > Review > Matching details',
        fieldsToValidate: ['Match status (should show a green check)'],
        tip: 'A red X means a mismatch — review the matching details to see which field is off.',
      },
      {
        stepNumber: 7,
        action: 'Post the invoice',
        navigation: 'Action Pane > Post',
        fieldsToValidate: ['Voucher number'],
      },
    ],
    commonPitfalls: [
      'Invoice quantity exceeds the product receipt quantity — you can only invoice what has been received.',
      'Unit price variance beyond the tolerance — if the invoice price differs from the PO price by more than the configured tolerance, posting is blocked.',
      'Product receipt not yet posted — ensure Receiving has confirmed the product receipt before you try to match.',
      'Attempting 2-way match logic on a 3-way match item — check the matching policy on the item or vendor.',
    ],
    expectedOutcome:
      'The invoice passes 3-way matching validation (PO price = Invoice price, Product receipt qty = Invoice qty), posts successfully, and the vendor balance updates.',
  },

  // 3. Create & Post Free Text Invoice (AR)
  {
    id: 'ar-free-text-invoice',
    title: 'Create & Post Free Text Invoice',
    module: 'Accounts Receivable',
    description:
      'Create a free text invoice to bill a customer for non-sales-order items such as miscellaneous charges, one-time fees, or service charges.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open the Free text invoice list page',
        navigation: 'Accounts receivable > Invoices > All free text invoices',
        fieldsToValidate: [],
      },
      {
        stepNumber: 2,
        action: 'Click "New" to create a free text invoice',
        navigation: 'Action Pane > New',
        fieldsToValidate: ['Customer account'],
        tip: 'Selecting the customer auto-fills the currency, payment terms, and default dimensions from the customer master.',
      },
      {
        stepNumber: 3,
        action: 'Enter invoice line details',
        navigation: 'Invoice lines FastTab',
        fieldsToValidate: [
          'Description',
          'Main account',
          'Quantity',
          'Unit price',
          'Sales tax group',
          'Item sales tax group',
          'Financial dimensions',
        ],
        tip: 'The main account is the revenue account. Financial dimensions on the line override the header defaults.',
      },
      {
        stepNumber: 4,
        action: 'Verify sales tax calculation',
        navigation: 'Action Pane > Sales tax (or Tax section on the line)',
        fieldsToValidate: [
          'Sales tax group',
          'Item sales tax group',
          'Calculated tax amount',
        ],
        tip: 'Ensure both the Sales tax group AND the Item sales tax group are set — tax is calculated at the intersection of these two groups.',
      },
      {
        stepNumber: 5,
        action: 'Post the invoice',
        navigation: 'Action Pane > Post',
        fieldsToValidate: ['Invoice number (generated after posting)', 'Voucher'],
      },
    ],
    commonPitfalls: [
      'Forgetting to set the Main account on the line — free text invoices require a GL account since there is no item/product reference.',
      'Sales tax not calculating — usually caused by a missing Sales tax group or Item sales tax group.',
      'Posting to a wrong financial dimension — double-check department/cost centre before posting.',
      'Customer is on hold — if the customer has a credit hold, posting may be blocked.',
    ],
    expectedOutcome:
      'The free text invoice posts, an invoice number is generated, the customer balance increases in the AR sub-ledger, and revenue and tax GL entries are created.',
  },

  // 4. General Journal Entry (GL)
  {
    id: 'gl-journal-entry',
    title: 'General Journal Entry',
    module: 'General Ledger',
    description:
      'Create and post a manual general journal entry for adjustments, accruals, reclassifications, or other entries that do not originate from a sub-ledger.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open the General journal form',
        navigation: 'General ledger > Journal entries > General journals',
        fieldsToValidate: ['Journal name'],
      },
      {
        stepNumber: 2,
        action: 'Create a new journal',
        navigation: 'Action Pane > New',
        fieldsToValidate: ['Journal batch number', 'Journal name', 'Description'],
        tip: 'Choose the journal name carefully — it controls the default offset account and approval workflow.',
      },
      {
        stepNumber: 3,
        action: 'Open journal lines',
        navigation: 'Action Pane > Lines',
        fieldsToValidate: [],
      },
      {
        stepNumber: 4,
        action: 'Enter the first journal line (debit side)',
        navigation: 'Journal voucher form',
        fieldsToValidate: [
          'Account type',
          'Account',
          'Debit amount',
          'Financial dimensions',
          'Description',
        ],
      },
      {
        stepNumber: 5,
        action: 'Enter the second journal line (credit side)',
        navigation: 'Journal voucher form — click New for a new line',
        fieldsToValidate: [
          'Account type',
          'Account',
          'Credit amount',
          'Financial dimensions',
          'Description',
        ],
        tip: 'The total debits must equal total credits. The form shows the balance at the bottom — it must be 0.00 before you can post.',
      },
      {
        stepNumber: 6,
        action: 'Validate the journal',
        navigation: 'Action Pane > Validate > Validate',
        fieldsToValidate: [],
      },
      {
        stepNumber: 7,
        action: 'Post the journal',
        navigation: 'Action Pane > Post',
        fieldsToValidate: ['Voucher number'],
      },
    ],
    commonPitfalls: [
      'Journal is out of balance — debits ≠ credits. Check the balance indicator at the bottom of the lines form.',
      'Wrong account type — selecting "Ledger" when you meant "Vendor" or "Customer" posts to a different sub-ledger.',
      'Missing or incorrect financial dimensions — especially when reclassifying between cost centres.',
      'Posting to a closed period — verify the period status in General ledger > Ledger calendar.',
    ],
    expectedOutcome:
      'The journal posts with a voucher number, GL balances update immediately, and the entry appears in the trial balance and voucher transactions inquiry.',
  },

  // 5. Period Open / Close (GL)
  {
    id: 'gl-period-open-close',
    title: 'Period Open / Close',
    module: 'General Ledger',
    description:
      'Manage fiscal period status to control which periods are open for posting. This is a critical governance step — open periods allow posting; closed periods block it.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open the Ledger calendar form',
        navigation: 'General ledger > Ledger calendar',
        fieldsToValidate: ['Fiscal calendar', 'Year'],
        tip: 'You may need to select the correct legal entity if you operate in multiple companies.',
      },
      {
        stepNumber: 2,
        action: 'Select the fiscal year and period to modify',
        navigation: 'Ledger calendar grid',
        fieldsToValidate: ['Period name', 'Period status'],
      },
      {
        stepNumber: 3,
        action: 'Change the period status',
        navigation: 'Click on the period > Update period status',
        fieldsToValidate: ['Module', 'New status (Open / On hold / Closed)'],
        tip: 'You can control period status per module — for example, keep GL open but close AP for a specific period.',
      },
      {
        stepNumber: 4,
        action: 'Confirm the status change',
        navigation: 'Confirmation dialog',
        fieldsToValidate: [],
        tip: 'Closing a period is reversible — you can reopen it if needed. However, follow your project\'s governance process before doing so.',
      },
    ],
    commonPitfalls: [
      'Closing a period while users still have unposted journals — communicate the close schedule to all teams.',
      'Forgetting to close the period for ALL modules — AP or AR periods left open can allow unexpected postings.',
      'Closing the wrong legal entity\'s period — always confirm you are in the correct company.',
      'Not understanding "On Hold" vs "Closed" — On Hold blocks most users but allows exceptions; Closed blocks everyone.',
    ],
    expectedOutcome:
      'The period status updates to the selected value (Open, On Hold, or Closed). Transactions targeting a closed period will be blocked with a clear error message.',
  },

  // 6. Fixed Asset Acquisition (FA)
  {
    id: 'fa-acquisition',
    title: 'Fixed Asset Acquisition',
    module: 'Fixed Assets',
    description:
      'Record the acquisition of a new fixed asset using a fixed asset journal. This creates the asset record, posts the acquisition cost, and starts depreciation tracking.',
    steps: [
      {
        stepNumber: 1,
        action: 'Create the fixed asset record (if not already created)',
        navigation: 'Fixed assets > Fixed assets > Fixed assets',
        fieldsToValidate: [
          'Fixed asset number',
          'Fixed asset group',
          'Name',
          'Type (Tangible / Intangible)',
        ],
        tip: 'The Fixed asset group controls default depreciation rules, GL posting profiles, and useful life. Choose carefully.',
      },
      {
        stepNumber: 2,
        action: 'Set up the depreciation book',
        navigation: 'Fixed asset record > Books FastTab',
        fieldsToValidate: [
          'Depreciation book',
          'Service life (years/months)',
          'Depreciation method',
          'Depreciation convention',
        ],
      },
      {
        stepNumber: 3,
        action: 'Open the Fixed asset journal',
        navigation: 'Fixed assets > Journal entries > Fixed assets journal',
        fieldsToValidate: ['Journal name'],
      },
      {
        stepNumber: 4,
        action: 'Create a new journal and open lines',
        navigation: 'Action Pane > New, then Lines',
        fieldsToValidate: [],
      },
      {
        stepNumber: 5,
        action: 'Enter the acquisition line',
        navigation: 'Journal voucher form',
        fieldsToValidate: [
          'Transaction type (set to Acquisition)',
          'Account (Fixed asset number)',
          'Book',
          'Debit amount (acquisition cost)',
          'Offset account (bank or vendor)',
          'Financial dimensions',
        ],
        tip: 'The transaction type must be "Acquisition" for the first entry against a new asset.',
      },
      {
        stepNumber: 6,
        action: 'Validate and post the journal',
        navigation: 'Action Pane > Validate > Validate, then Post',
        fieldsToValidate: ['Voucher number'],
      },
    ],
    commonPitfalls: [
      'Selecting the wrong transaction type — "Acquisition" must be used for the first transaction on a new asset.',
      'Fixed asset group mismatch — if the group\'s depreciation profile doesn\'t match your asset type, depreciation will calculate incorrectly.',
      'Forgetting to set up the Book on the asset record before posting the acquisition — the journal will error.',
      'Entering the wrong acquisition date — this affects the depreciation start date and first-year depreciation calculation.',
    ],
    expectedOutcome:
      'The asset acquisition posts, the asset status changes from "Not yet acquired" to "Open", the acquisition cost appears in the Fixed asset balance inquiry, and the GL reflects a debit to the asset account and credit to the offset account.',
  },

  // 7. Bank Reconciliation (Cash & Bank)
  {
    id: 'bank-reconciliation',
    title: 'Bank Reconciliation',
    module: 'Cash & Bank Management',
    description:
      'Import a bank statement and reconcile it against D365FO bank transactions. This ensures the system bank balance matches the actual bank balance.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open Bank reconciliation worksheet',
        navigation: 'Cash and bank management > Bank statement reconciliation > Bank reconciliation',
        fieldsToValidate: ['Bank account'],
      },
      {
        stepNumber: 2,
        action: 'Import the bank statement',
        navigation: 'Action Pane > Import statement',
        fieldsToValidate: [
          'Statement ID',
          'Bank account',
          'Statement date',
          'File format',
        ],
        tip: 'The import format must match the bank statement format configured in Cash and bank management > Setup > Advanced bank reconciliation setup.',
      },
      {
        stepNumber: 3,
        action: 'Review imported bank statement lines',
        navigation: 'Bank statement lines FastTab',
        fieldsToValidate: [
          'Date',
          'Amount',
          'Description / Reference',
          'Transaction type',
        ],
      },
      {
        stepNumber: 4,
        action: 'Run matching rules (or match manually)',
        navigation: 'Action Pane > Match > Run matching rules (or drag-and-drop for manual matching)',
        fieldsToValidate: ['Matched status on each line'],
        tip: 'Automatic matching rules compare amounts, dates, and references. Unmatched items need manual review.',
      },
      {
        stepNumber: 5,
        action: 'Review and resolve unmatched transactions',
        navigation: 'Unmatched transactions sections',
        fieldsToValidate: [],
        tip: 'Unmatched bank lines may need to be recorded as new transactions in D365 (e.g., bank fees, interest). Unmatched D365 transactions may indicate a timing difference.',
      },
      {
        stepNumber: 6,
        action: 'Reconcile and confirm',
        navigation: 'Action Pane > Reconcile',
        fieldsToValidate: [
          'Statement ending balance',
          'D365 bank balance',
          'Difference (should be 0.00)',
        ],
      },
    ],
    commonPitfalls: [
      'Wrong import format — the bank statement format must be configured before import. BAI2, MT940, and CSV are common formats.',
      'Matching rule not finding matches — check that the reference fields in D365 match what the bank sends.',
      'Not accounting for bank fees or interest — these are on the bank statement but may not be in D365 yet.',
      'Reconciling against the wrong bank account — verify the bank account number before starting.',
    ],
    expectedOutcome:
      'All bank statement lines are matched to D365 transactions (or new transactions are created for unmatched items). The reconciliation completes with a zero difference, and the bank account is marked as reconciled for the statement period.',
  },

  // 8. Vendor Payment Journal (AP)
  {
    id: 'ap-vendor-payment',
    title: 'Vendor Payment Journal',
    module: 'Accounts Payable',
    description:
      'Create a vendor payment journal to pay open vendor invoices. This flow covers creating the payment journal, selecting invoices via the payment proposal, and posting the payment.',
    steps: [
      {
        stepNumber: 1,
        action: 'Open the Vendor payment journal',
        navigation: 'Accounts payable > Payments > Vendor payment journal',
        fieldsToValidate: ['Journal name'],
      },
      {
        stepNumber: 2,
        action: 'Create a new journal',
        navigation: 'Action Pane > New',
        fieldsToValidate: ['Journal name', 'Description'],
        tip: 'The journal name determines the default bank account (offset account) for payments.',
      },
      {
        stepNumber: 3,
        action: 'Open journal lines',
        navigation: 'Action Pane > Lines',
        fieldsToValidate: [],
      },
      {
        stepNumber: 4,
        action: 'Use Payment proposal to select invoices',
        navigation: 'Action Pane > Payment proposal > Create payment proposal',
        fieldsToValidate: [
          'Method of payment',
          'Due date range (From / To)',
          'Vendor account (optional filter)',
        ],
        tip: 'The payment proposal automatically selects open invoices based on due dates and payment terms. Review the results before transferring.',
      },
      {
        stepNumber: 5,
        action: 'Review and transfer the proposal to journal lines',
        navigation: 'Payment proposal results > Transfer to journal',
        fieldsToValidate: [
          'Vendor account',
          'Invoice number',
          'Amount to pay',
          'Payment date',
        ],
      },
      {
        stepNumber: 6,
        action: 'Generate the payment file (if paying electronically)',
        navigation: 'Action Pane > Generate payments',
        fieldsToValidate: [
          'Method of payment',
          'Bank account',
          'Export format',
        ],
        tip: 'For check payments, use "Generate payments" to print checks. For EFT/ACH, this generates the bank file.',
      },
      {
        stepNumber: 7,
        action: 'Post the payment journal',
        navigation: 'Action Pane > Post',
        fieldsToValidate: ['Voucher number'],
      },
    ],
    commonPitfalls: [
      'Payment proposal returns no results — check the due date range and ensure invoices are posted and approved.',
      'Wrong method of payment — each vendor may have a default method. Mixing check and EFT in one journal can cause issues.',
      'Bank account not configured for the export format — ensure the bank account is set up for the payment method (EFT, check, etc.).',
      'Partial payment not applied correctly — if paying less than the full invoice, verify the settlement is correct.',
      'Forgetting to generate the payment file before posting — posting without generating loses the ability to create the bank file.',
    ],
    expectedOutcome:
      'The payment journal posts, vendor balances decrease, the bank account balance decreases, and open invoices are settled (marked as paid). If electronic, a payment file is generated for upload to the bank.',
  },
];

// ---------------------------------------------------------------------------
// D365 Finance Modules
// ---------------------------------------------------------------------------

export const D365_MODULES = [
  {
    id: 'gl',
    name: 'General Ledger',
    description:
      'The core financial module for chart of accounts, journal entries, financial reporting, period management, consolidations, and intercompany accounting.',
  },
  {
    id: 'ap',
    name: 'Accounts Payable',
    description:
      'Manages vendor invoices, purchase order matching, vendor payments, 1099 reporting, and the AP sub-ledger. Handles the full procure-to-pay cycle on the finance side.',
  },
  {
    id: 'ar',
    name: 'Accounts Receivable',
    description:
      'Manages customer invoices (sales order and free text), customer payments, credit management, collection letters, and the AR sub-ledger.',
  },
  {
    id: 'fa',
    name: 'Fixed Assets',
    description:
      'Tracks fixed asset lifecycle from acquisition through depreciation to disposal. Manages depreciation books, asset groups, and integrates with GL for posting.',
  },
  {
    id: 'budget',
    name: 'Budgeting',
    description:
      'Supports budget planning, budget register entries, budget control (preventing over-budget spending), and budget vs. actual reporting.',
  },
  {
    id: 'cash',
    name: 'Cash & Bank Management',
    description:
      'Manages bank accounts, bank reconciliation (including advanced bank reconciliation), cash flow forecasting, and bank transaction monitoring.',
  },
  {
    id: 'credit',
    name: 'Credit & Collections',
    description:
      'Manages customer credit limits, credit holds, aging analysis, collection letters, interest notes, and write-off processes.',
  },
  {
    id: 'tax',
    name: 'Tax',
    description:
      'Configures sales tax groups, item sales tax groups, tax codes, tax calculation, withholding tax, and tax reporting across jurisdictions.',
  },
];
