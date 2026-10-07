/**
 * TAJ FLYSCREEN - QUOTATION MANAGEMENT SYSTEM
 * High-performance mobile-first Quotation Engine with pixel-perfect A4 printing,
 * custom quick-add products management, manual entry controls, and WhatsApp PDF generation.
 */

// ==========================================================================
// DEFAULT SETTINGS & INITIAL DATA
// ==========================================================================

const DEFAULT_COMPANY_SETTINGS = {
  companyAddress: "Al Sajaa Industrial, Sharjah",
  tel: "+971 505106430",
  email: "sales.ae@tajglb.com",
  website: "www.tajflyscreen.com",
  licenseNo: "924650",
  taxNo: "105090748200003",
  bankAccName: "Taj Al Shemoukh Industries LLC",
  bankAccNo: "3708504364201",
  bankIban: "AE340340003708504364201",
  bankName: "Emirates Islamic, Qasimiyah Branch, Sharjah"
};

const DEFAULT_QUICK_PRODUCTS = [
  {
    desc: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
    notes: "TOP TO BOTTOM",
    rate: 140.00,
    unit: "SQMTR"
  },
  {
    desc: "DOUBLE OPEN PLEATED FLYSCREEN BLACK",
    notes: "TOP TO BOTTOM",
    rate: 150.00,
    unit: "SQMTR"
  },
  {
    desc: "BARRIER FREE PLEATED FLYSCREEN GREY",
    notes: "BOTTOM TRACK LESS",
    rate: 180.00,
    unit: "SQMTR"
  },
  {
    desc: "ROLLER FLYSCREEN WHITE",
    notes: "WINDOW SYSTEM",
    rate: 130.00,
    unit: "SQMTR"
  },
  {
    desc: "FIXED FRAME FLYSCREEN",
    notes: "CLIP-ON",
    rate: 110.00,
    unit: "SQMTR"
  }
];

const SAMPLE_QUOTE = {
  id: "quote_sample_668",
  quoteNo: "668",
  quoteDate: "07-Oct-2026",
  lpoNo: "",
  lpoDate: "",
  salesman: "",
  paymentTerms: "",
  customerName: "DIAMOND STEP ALUMINIUM AND GLASS",
  customerVatin: "",
  customerPhone: "0521549462",
  contactPerson: "MR. SAJI",
  contactNo: "+971521549462",
  customerAddress: "SAJAA INDUSTRIAL AREA\nSHARJAH",
  items: [
    {
      no: 1,
      code: "",
      description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
      notes: "TOP TO BOTTOM",
      width: 1027,
      height: 1370,
      qty: 2,
      unit: "SQMTR",
      totSqm: 2.81,
      rate: 140.00,
      amount: 393.96,
      manualTotSqm: false,
      manualAmount: false
    },
    {
      no: 2,
      code: "",
      description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
      notes: "TOP TO BOTTOM",
      width: 1100,
      height: 1350,
      qty: 4,
      unit: "SQMTR",
      totSqm: 5.94,
      rate: 140.00,
      amount: 831.60,
      manualTotSqm: false,
      manualAmount: false
    },
    {
      no: 3,
      code: "",
      description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
      notes: "TOP TO BOTTOM",
      width: 1000,
      height: 915,
      qty: 4,
      unit: "SQMTR",
      totSqm: 3.66,
      rate: 140.00,
      amount: 512.40,
      manualTotSqm: false,
      manualAmount: false
    },
    {
      no: 4,
      code: "",
      description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
      notes: "TOP TO BOTTOM",
      width: 1370,
      height: 913,
      qty: 2,
      unit: "SQMTR",
      totSqm: 2.50,
      rate: 140.00,
      amount: 350.28,
      manualTotSqm: false,
      manualAmount: false
    },
    {
      no: 5,
      code: "",
      description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
      notes: "TOP TO BOTTOM",
      width: 1000,
      height: 900,
      qty: 4,
      unit: "SQMTR",
      totSqm: 3.60,
      rate: 140.00,
      amount: 504.00,
      manualTotSqm: false,
      manualAmount: false
    }
  ],
  discount1: 0,
  discount2: 0,
  vatRate: 5,
  roundOff: -1.85,
  amountInWords: "Dirham Two Thousand Seven Hundred Twenty Only",
  remarks: "",
  updatedAt: new Date().toISOString()
};

// Application Global State
let appState = {
  currentQuote: JSON.parse(JSON.stringify(SAMPLE_QUOTE)),
  companySettings: JSON.parse(JSON.stringify(DEFAULT_COMPANY_SETTINGS)),
  quickProducts: JSON.parse(JSON.stringify(DEFAULT_QUICK_PRODUCTS)),
  savedQuotes: [],
  activeView: 'editor',
  isAutoCalc: true
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadStoredData();
  initFormInputs();
  renderQuickProductChips();
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  populateCustomerPresets();
  updateSavedCountBadge();

  if (window.innerWidth <= 1100) {
    switchView('editor');
  } else {
    document.body.className = 'view-editor';
  }
});

// ==========================================================================
// STORAGE MANAGEMENT
// ==========================================================================

function loadStoredData() {
  try {
    const storedSettings = localStorage.getItem('taj_company_settings');
    if (storedSettings) {
      appState.companySettings = Object.assign({}, DEFAULT_COMPANY_SETTINGS, JSON.parse(storedSettings));
    }

    const storedProducts = localStorage.getItem('taj_quick_products');
    if (storedProducts) {
      appState.quickProducts = JSON.parse(storedProducts);
    } else {
      appState.quickProducts = JSON.parse(JSON.stringify(DEFAULT_QUICK_PRODUCTS));
      saveQuickProductsToStorage();
    }

    const storedQuotes = localStorage.getItem('taj_saved_quotes');
    if (storedQuotes) {
      appState.savedQuotes = JSON.parse(storedQuotes);
    } else {
      appState.savedQuotes = [JSON.parse(JSON.stringify(SAMPLE_QUOTE))];
      saveQuotesToStorage();
    }

    const storedActiveQuote = localStorage.getItem('taj_active_quote');
    if (storedActiveQuote) {
      appState.currentQuote = JSON.parse(storedActiveQuote);
    } else {
      appState.currentQuote = JSON.parse(JSON.stringify(SAMPLE_QUOTE));
    }
  } catch (err) {
    console.error('Error loading stored data:', err);
  }
}

function saveQuotesToStorage() {
  try {
    localStorage.setItem('taj_saved_quotes', JSON.stringify(appState.savedQuotes));
    updateSavedCountBadge();
    populateCustomerPresets();
  } catch (err) {
    console.error('Error saving quotes:', err);
  }
}

function saveQuickProductsToStorage() {
  try {
    localStorage.setItem('taj_quick_products', JSON.stringify(appState.quickProducts));
    renderQuickProductChips();
  } catch (err) {
    console.error('Error saving quick products:', err);
  }
}

function autoSaveActiveQuote() {
  try {
    appState.currentQuote.updatedAt = new Date().toISOString();
    localStorage.setItem('taj_active_quote', JSON.stringify(appState.currentQuote));
    
    const idx = appState.savedQuotes.findIndex(q => q.id === appState.currentQuote.id);
    if (idx !== -1) {
      appState.savedQuotes[idx] = JSON.parse(JSON.stringify(appState.currentQuote));
      saveQuotesToStorage();
    }
    
    const statusText = document.getElementById('saveStatusText');
    if (statusText) {
      statusText.textContent = "Auto-saved locally";
    }
  } catch (err) {
    console.error('Error in auto-save:', err);
  }
}

function updateSavedCountBadge() {
  const badge = document.getElementById('savedCountBadge');
  if (badge) {
    badge.textContent = appState.savedQuotes.length;
  }
}

// ==========================================================================
// VIEW SWITCHER
// ==========================================================================

function switchView(viewName) {
  appState.activeView = viewName;
  document.body.className = `view-${viewName}`;
  
  const tabEditor = document.getElementById('tabEditorBtn');
  const tabPreview = document.getElementById('tabPreviewBtn');

  if (viewName === 'editor') {
    tabEditor?.classList.add('active');
    tabPreview?.classList.remove('active');
  } else {
    tabPreview?.classList.add('active');
    tabEditor?.classList.remove('active');
    updateLiveDocument();
  }
}

// ==========================================================================
// FORM DATA BINDING
// ==========================================================================

function initFormInputs() {
  const q = appState.currentQuote;
  
  setVal('custName', q.customerName);
  setVal('custPhone', q.customerPhone);
  setVal('custVatin', q.customerVatin);
  setVal('custContactPerson', q.contactPerson);
  setVal('custContactNo', q.contactNo);
  setVal('custAddress', q.customerAddress);

  setVal('quoteNo', q.quoteNo);
  setVal('quoteDate', q.quoteDate);
  setVal('lpoNo', q.lpoNo);
  setVal('lpoDate', q.lpoDate);
  setVal('salesman', q.salesman);
  setVal('paymentTerms', q.paymentTerms);

  setVal('discount1', q.discount1);
  setVal('discount2', q.discount2);
  setVal('vatRate', q.vatRate);
  setVal('roundOff', q.roundOff);
  setVal('amountInWords', q.amountInWords);
  setVal('quoteRemarks', q.remarks);

  const toggle = document.getElementById('autoCalcToggle');
  if (toggle) toggle.checked = appState.isAutoCalc;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}

function updateField(fieldKey, value) {
  appState.currentQuote[fieldKey] = value;
  
  if (['discount1', 'discount2', 'vatRate', 'roundOff'].includes(fieldKey)) {
    recalculateAll();
  }
  
  updateLiveDocument();
  autoSaveActiveQuote();
}

function toggleAutoCalculation(isChecked) {
  appState.isAutoCalc = isChecked;
  showToast(isChecked ? "Auto-calculation enabled" : "Manual entry mode enabled", "info");
  if (isChecked) {
    recalculateAll();
    renderItemsTable();
    updateLiveDocument();
  }
}

// ==========================================================================
// QUICK ADD PRODUCTS MANAGEMENT (SETTINGS & CHIPS)
// ==========================================================================

function renderQuickProductChips() {
  const container = document.getElementById('quickProductsChipsList');
  if (!container) return;

  container.innerHTML = '';
  appState.quickProducts.forEach((prod) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'preset-chip';
    chip.innerHTML = `<span>${escapeHtml(prod.desc)}</span> <small style="opacity:0.75">(${prod.rate} AED)</small>`;
    chip.onclick = () => quickAddItem(prod.desc, prod.notes, prod.rate, prod.unit);
    container.appendChild(chip);
  });
}

function switchSettingsTab(tabName) {
  const companyTab = document.getElementById('settingsCompanyTab');
  const productsTab = document.getElementById('settingsProductsTab');
  const tabBtnComp = document.getElementById('tabSettingsCompany');
  const tabBtnProd = document.getElementById('tabSettingsProducts');

  if (tabName === 'company') {
    if (companyTab) companyTab.style.display = 'grid';
    if (productsTab) productsTab.style.display = 'none';
    tabBtnComp?.classList.add('active');
    tabBtnProd?.classList.remove('active');
  } else {
    if (companyTab) companyTab.style.display = 'none';
    if (productsTab) productsTab.style.display = 'block';
    tabBtnProd?.classList.add('active');
    tabBtnComp?.classList.remove('active');
    renderSettingsProductList();
  }
}

function renderSettingsProductList() {
  const listEl = document.getElementById('settingsProductsList');
  if (!listEl) return;

  listEl.innerHTML = '';
  if (appState.quickProducts.length === 0) {
    listEl.innerHTML = '<div style="color: var(--text-muted); padding: 10px;">No custom products added yet.</div>';
    return;
  }

  appState.quickProducts.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'product-item-row';
    row.innerHTML = `
      <div class="product-item-meta">
        <span class="product-item-name">${escapeHtml(p.desc)}</span>
        <span class="product-item-sub">Notes: ${escapeHtml(p.notes || '-')} | Rate: <strong>${p.rate} AED</strong> | Unit: ${p.unit}</span>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteQuickProduct(${idx})">&times; Remove</button>
    `;
    listEl.appendChild(row);
  });
}

function saveNewQuickProduct() {
  const desc = document.getElementById('newProdDesc')?.value.trim();
  const notes = document.getElementById('newProdNotes')?.value.trim();
  const rate = parseFloat(document.getElementById('newProdRate')?.value) || 0;
  const unit = document.getElementById('newProdUnit')?.value || 'SQMTR';

  if (!desc) {
    alert("Please enter a product description or name.");
    return;
  }

  appState.quickProducts.push({ desc, notes, rate, unit });
  saveQuickProductsToStorage();
  renderSettingsProductList();

  // Reset inputs
  setVal('newProdDesc', '');
  setVal('newProdNotes', '');
  setVal('newProdRate', '');

  showToast(`Added '${desc}' to Quick Products!`);
}

function deleteQuickProduct(index) {
  appState.quickProducts.splice(index, 1);
  saveQuickProductsToStorage();
  renderSettingsProductList();
  showToast("Quick product removed");
}

// ==========================================================================
// ITEMS TABLE MANAGEMENT (MANUAL ENTRY FRIENDLY, NO SPINNER OVERLAP)
// ==========================================================================

function renderItemsTable() {
  const tbody = document.getElementById('itemsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const items = appState.currentQuote.items;

  items.forEach((item, index) => {
    item.no = index + 1;
    const tr = document.createElement('tr');
    tr.id = `item_row_${index}`;
    tr.innerHTML = `
      <td><span class="row-num-badge">${item.no}</span></td>
      <td>
        <input type="text" value="${escapeHtml(item.code || '')}" 
          placeholder="Code" oninput="updateItemField(${index}, 'code', this.value)">
      </td>
      <td>
        <input type="text" value="${escapeHtml(item.description || '')}" 
          placeholder="Product Description" oninput="updateItemField(${index}, 'description', this.value)">
      </td>
      <td>
        <input type="text" value="${escapeHtml(item.notes || '')}" 
          placeholder="e.g. TOP TO BOTTOM" oninput="updateItemField(${index}, 'notes', this.value)">
      </td>
      <td>
        <input type="number" class="num-input" value="${item.width || ''}" 
          placeholder="Width" oninput="updateItemField(${index}, 'width', parseFloat(this.value) || 0)">
      </td>
      <td>
        <input type="number" class="num-input" value="${item.height || ''}" 
          placeholder="Height" oninput="updateItemField(${index}, 'height', parseFloat(this.value) || 0)">
      </td>
      <td>
        <input type="number" class="num-input" value="${item.qty || 1}" 
          min="1" placeholder="Qty" oninput="updateItemField(${index}, 'qty', parseFloat(this.value) || 1)">
      </td>
      <td>
        <select onchange="updateItemField(${index}, 'unit', this.value)">
          <option value="SQMTR" ${item.unit === 'SQMTR' ? 'selected' : ''}>SQMTR</option>
          <option value="PCS" ${item.unit === 'PCS' ? 'selected' : ''}>PCS</option>
          <option value="RM" ${item.unit === 'RM' ? 'selected' : ''}>RM</option>
          <option value="SET" ${item.unit === 'SET' ? 'selected' : ''}>SET</option>
        </select>
      </td>
      <td>
        <input type="number" step="0.01" class="num-input manual-editable" 
          id="row_totSqm_${index}"
          value="${item.totSqm !== undefined ? Number(item.totSqm).toFixed(2) : '0.00'}" 
          title="Directly editable manually"
          oninput="handleManualTotSqm(${index}, this.value)">
      </td>
      <td>
        <input type="number" step="0.01" class="num-input" 
          value="${item.rate || 0}" oninput="updateItemField(${index}, 'rate', parseFloat(this.value) || 0)">
      </td>
      <td>
        <input type="number" step="0.01" class="num-input manual-editable" 
          id="row_amount_${index}"
          value="${item.amount !== undefined ? Number(item.amount).toFixed(2) : '0.00'}" 
          title="Directly editable manually"
          oninput="handleManualAmount(${index}, this.value)">
      </td>
      <td>
        <button type="button" class="btn-row-del" onclick="deleteItemRow(${index})" title="Delete row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleManualTotSqm(index, val) {
  const item = appState.currentQuote.items[index];
  if (!item) return;
  item.totSqm = parseFloat(val) || 0;
  item.manualTotSqm = true;

  // If auto-calc is on, calculate amount from manual SqM * rate
  if (appState.isAutoCalc && !item.manualAmount) {
    const rate = parseFloat(item.rate) || 0;
    item.amount = Math.round(item.totSqm * rate * 100) / 100;
    const amountEl = document.getElementById(`row_amount_${index}`);
    if (amountEl) amountEl.value = item.amount.toFixed(2);
  }

  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
}

function handleManualAmount(index, val) {
  const item = appState.currentQuote.items[index];
  if (!item) return;
  item.amount = parseFloat(val) || 0;
  item.manualAmount = true;

  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
}

function updateItemField(index, key, value) {
  const item = appState.currentQuote.items[index];
  if (!item) return;

  item[key] = value;

  // Auto-calculate Tot SqM and Amount if auto-calc is active and user hasn't overridden
  if (appState.isAutoCalc && ['width', 'height', 'qty', 'rate', 'unit'].includes(key)) {
    const w = parseFloat(item.width) || 0;
    const h = parseFloat(item.height) || 0;
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;

    if (item.unit === 'SQMTR' && w > 0 && h > 0) {
      const exactSqm = (w * h * qty) / 1000000;
      if (!item.manualTotSqm) {
        item.totSqm = Math.round(exactSqm * 100) / 100;
        const totSqmEl = document.getElementById(`row_totSqm_${index}`);
        if (totSqmEl) totSqmEl.value = item.totSqm.toFixed(2);
      }
      if (!item.manualAmount) {
        const calcPrecision = Math.round(exactSqm * 1000) / 1000;
        item.amount = Math.round(calcPrecision * rate * 100) / 100;
        const amountEl = document.getElementById(`row_amount_${index}`);
        if (amountEl) amountEl.value = item.amount.toFixed(2);
      }
    } else if (item.unit === 'PCS' || item.unit === 'SET') {
      if (!item.manualTotSqm) {
        item.totSqm = 0;
        const totSqmEl = document.getElementById(`row_totSqm_${index}`);
        if (totSqmEl) totSqmEl.value = "0.00";
      }
      if (!item.manualAmount) {
        item.amount = Math.round(qty * rate * 100) / 100;
        const amountEl = document.getElementById(`row_amount_${index}`);
        if (amountEl) amountEl.value = item.amount.toFixed(2);
      }
    } else if (item.unit === 'RM') {
      const lengthM = ((w > 0 ? w : h) / 1000) * qty;
      if (!item.manualTotSqm) {
        item.totSqm = 0;
        const totSqmEl = document.getElementById(`row_totSqm_${index}`);
        if (totSqmEl) totSqmEl.value = "0.00";
      }
      if (!item.manualAmount) {
        item.amount = Math.round(lengthM * rate * 100) / 100;
        const amountEl = document.getElementById(`row_amount_${index}`);
        if (amountEl) amountEl.value = item.amount.toFixed(2);
      }
    }
  }

  // Do NOT re-render the entire table here so user's cursor / typing focus is never lost!
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
}

function addNewItemRow() {
  const items = appState.currentQuote.items;
  const newItem = {
    no: items.length + 1,
    code: "",
    description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
    notes: "TOP TO BOTTOM",
    width: 1000,
    height: 1000,
    qty: 1,
    unit: "SQMTR",
    totSqm: 1.00,
    rate: 140.00,
    amount: 140.00,
    manualTotSqm: false,
    manualAmount: false
  };
  items.push(newItem);
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  showToast("Added new line item");
}

function quickAddItem(desc, notes, defaultRate, unit = "SQMTR") {
  const items = appState.currentQuote.items;
  items.push({
    no: items.length + 1,
    code: "",
    description: desc,
    notes: notes,
    width: 1000,
    height: 1000,
    qty: 1,
    unit: unit,
    totSqm: unit === 'SQMTR' ? 1.00 : 0,
    rate: defaultRate,
    amount: defaultRate,
    manualTotSqm: false,
    manualAmount: false
  });
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  showToast(`Added: ${desc}`);
}

function deleteItemRow(index) {
  if (appState.currentQuote.items.length <= 1) {
    showToast("Quotation must have at least one item", "info");
    return;
  }
  appState.currentQuote.items.splice(index, 1);
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
}

// ==========================================================================
// TOTALS & FINANCIAL RECALCULATION
// ==========================================================================

function recalculateAll() {
  const q = appState.currentQuote;
  const items = q.items;

  let totalQty = 0;
  let totalSqm = 0;
  let totalRm = 0;
  let subtotalAmount = 0;

  items.forEach(item => {
    const qty = parseFloat(item.qty) || 0;
    const sqm = parseFloat(item.totSqm) || 0;
    const amt = parseFloat(item.amount) || 0;

    totalQty += qty;
    totalSqm += sqm;
    if (item.unit === 'RM') {
      totalRm += qty;
    }
    subtotalAmount += amt;
  });

  const disc1 = parseFloat(q.discount1) || 0;
  const disc2 = parseFloat(q.discount2) || 0;
  const totalBeforeVat = Math.max(0, subtotalAmount - disc1 - disc2);

  const vatRate = parseFloat(q.vatRate) || 0;
  const vatAmount = Math.round(totalBeforeVat * (vatRate / 100) * 100) / 100;

  const roundOff = parseFloat(q.roundOff) || 0;
  const netAmount = Math.round((totalBeforeVat + vatAmount + roundOff) * 100) / 100;

  q.calculated = {
    totalQty,
    totalSqm: Math.round(totalSqm * 100) / 100,
    totalRm: Math.round(totalRm * 100) / 100,
    subtotalAmount: Math.round(subtotalAmount * 100) / 100,
    totalBeforeVat: Math.round(totalBeforeVat * 100) / 100,
    vatAmount,
    netAmount
  };

  setText('dispTotalQty', totalQty);
  setText('dispTotalSqm', q.calculated.totalSqm.toFixed(2));
  setText('dispSubtotal', formatCurrency(q.calculated.subtotalAmount));
  setText('dispNetAmount', formatCurrency(netAmount));

  if (!q.amountInWords || q.amountInWords.trim() === '') {
    q.amountInWords = numberToDirhamsWords(netAmount);
    setVal('amountInWords', q.amountInWords);
  }
}

function autoRoundToInteger() {
  const q = appState.currentQuote;
  if (!q.calculated) recalculateAll();

  const totalWithVat = q.calculated.totalBeforeVat + q.calculated.vatAmount;
  const roundedInt = Math.round(totalWithVat);
  const diff = Math.round((roundedInt - totalWithVat) * 100) / 100;

  q.roundOff = diff;
  setVal('roundOff', diff);
  recalculateAll();
  regenerateAmountInWords();
  updateLiveDocument();
  autoSaveActiveQuote();
  showToast(`Auto rounded to nearest Dirham (${diff > 0 ? '+' : ''}${diff.toFixed(2)})`);
}

function regenerateAmountInWords() {
  const q = appState.currentQuote;
  const net = q.calculated ? q.calculated.netAmount : 0;
  q.amountInWords = numberToDirhamsWords(net);
  setVal('amountInWords', q.amountInWords);
  updateLiveDocument();
  autoSaveActiveQuote();
}

// ==========================================================================
// NUMBER TO WORDS (UAE DIRHAMS)
// ==========================================================================

function numberToDirhamsWords(amount) {
  if (isNaN(amount) || amount === 0) return "Dirham Zero Only";

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const dirhams = Math.floor(absAmount);
  const fils = Math.round((absAmount - dirhams) * 100);

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
                 "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertGroup(n) {
    let str = "";
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += units[n] + " ";
    }
    return str.trim();
  }

  let words = "";
  if (dirhams === 0) {
    words = "Zero";
  } else {
    const millions = Math.floor(dirhams / 1000000);
    const thousands = Math.floor((dirhams % 1000000) / 1000);
    const remainder = dirhams % 1000;

    if (millions > 0) words += convertGroup(millions) + " Million ";
    if (thousands > 0) words += convertGroup(thousands) + " Thousand ";
    if (remainder > 0) words += convertGroup(remainder) + " ";
  }

  words = words.trim();
  let result = (isNegative ? "Minus " : "") + "Dirham " + words;

  if (fils > 0) {
    result += ` and ${convertGroup(fils)} Fils`;
  }

  result += " Only";
  return result;
}

// ==========================================================================
// RENDER LIVE A4 DOCUMENT (PRINT-PERFECT)
// ==========================================================================

function updateLiveDocument() {
  const q = appState.currentQuote;
  const s = appState.companySettings;
  const calc = q.calculated || {
    totalQty: 0, totalSqm: 0, totalRm: 0, subtotalAmount: 0, totalBeforeVat: 0, vatAmount: 0, netAmount: 0
  };

  setText('docAddressLine', s.companyAddress);
  setText('docTel', s.tel);
  setText('docEmail', s.email);
  setText('docWebsite', s.website);
  setText('docLicenseNo', s.licenseNo);
  setText('docTaxNo', s.taxNo);

  setText('docCustName', q.customerName || '-');
  setText('docCustVatin', q.customerVatin || '');
  setText('docCustPhone', q.customerPhone || '');
  setText('docCustContactPerson', q.contactPerson || '');
  setText('docCustContactNo', q.contactNo || '');
  setText('docCustAddress', q.customerAddress || '');

  setText('docQuoteNo', q.quoteNo || '');
  setText('docQuoteDate', q.quoteDate || '');
  setText('docLpoNo', q.lpoNo || '');
  setText('docLpoDate', q.lpoDate || '');

  const docBody = document.getElementById('docItemsBody');
  if (docBody) {
    docBody.innerHTML = '';
    q.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="col-no">${item.no}</td>
        <td class="col-code">${escapeHtml(item.code || '')}</td>
        <td class="col-desc"><strong>${escapeHtml(item.description || '')}</strong></td>
        <td class="col-notes">${escapeHtml(item.notes || '')}</td>
        <td class="col-num">${item.width || ''}</td>
        <td class="col-num">${item.height || ''}</td>
        <td class="col-num">${item.qty || 1}</td>
        <td class="col-unit">${escapeHtml(item.unit || 'SQMTR')}</td>
        <td class="col-num">${item.totSqm !== undefined ? Number(item.totSqm).toFixed(2) : '0.00'}</td>
        <td class="col-num">${Number(item.rate || 0).toFixed(2)}</td>
        <td class="col-num"><strong>${Number(item.amount || 0).toFixed(2)}</strong></td>
      `;
      docBody.appendChild(tr);
    });
  }

  setText('docTotalQty', calc.totalQty);
  setText('docTotalSqm', calc.totalSqm.toFixed(2));
  setText('docTotalRm', calc.totalRm.toFixed(2));

  setText('docTotalAmount', calc.subtotalAmount.toFixed(2));
  setText('docDiscount', (parseFloat(q.discount1) || 0).toFixed(2));
  setText('docDiscount2', (parseFloat(q.discount2) || 0).toFixed(2));
  setText('docTotalBeforeVat', calc.totalBeforeVat.toFixed(2));
  setText('docVatAmount', calc.vatAmount.toFixed(2));
  setText('docRoundOff', (parseFloat(q.roundOff) || 0).toFixed(2));
  setText('docNetAmount', calc.netAmount.toFixed(2));

  setText('docAmountWords', q.amountInWords || numberToDirhamsWords(calc.netAmount));
  setText('docRemarks', q.remarks || '');

  setText('docBankAccName', s.bankAccName);
  setText('docBankAccNo', s.bankAccNo);
  setText('docBankIban', s.bankIban);
  setText('docBankName', s.bankName);

  setText('docPaymentTerms', q.paymentTerms || '');
  setText('docSalesman', q.salesman || '');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text !== undefined && text !== null ? text : '';
}

function formatCurrency(val) {
  return `${(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// ==========================================================================
// PRINT QUOTATION ENGINE (MATCHES PRINT PREVIEW 100%)
// ==========================================================================

function printQuotationDoc() {
  updateLiveDocument();
  // Ensure the preview sheet is fully updated before calling print
  setTimeout(() => {
    window.print();
  }, 120);
}

// ==========================================================================
// A4 PDF ENGINE - GUARANTEES IDENTICAL LOOK TO PRINT PREVIEW ON ALL DEVICES
// ==========================================================================

async function generateA4PdfBlob(filename) {
  updateLiveDocument();

  const originalSheet = document.getElementById('quotationSheet');
  if (!originalSheet) throw new Error('Quotation sheet element not found');

  // Create an off-screen staging wrapper with fixed desktop A4 dimensions (800px)
  // This ensures mobile screens NEVER shrink or distort the downloaded PDF!
  const stagingContainer = document.createElement('div');
  stagingContainer.style.position = 'fixed';
  stagingContainer.style.left = '-9999px';
  stagingContainer.style.top = '0';
  stagingContainer.style.width = '800px';
  stagingContainer.style.background = '#ffffff';
  stagingContainer.style.zIndex = '-9999';

  const clone = originalSheet.cloneNode(true);
  clone.style.width = '800px';
  clone.style.maxWidth = '800px';
  clone.style.minHeight = '1120px';
  clone.style.margin = '0';
  clone.style.padding = '30px 34px';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.boxSizing = 'border-box';
  clone.style.background = '#ffffff';

  stagingContainer.appendChild(clone);
  document.body.appendChild(stagingContainer);

  const opt = {
    margin: [0, 0, 0, 0],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // 2x resolution for crisp text and logos
      useCORS: true,
      letterRendering: true,
      width: 800,
      windowWidth: 1200 // forces desktop layout media queries
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  try {
    const pdfBlob = await html2pdf().set(opt).from(clone).output('blob');
    document.body.removeChild(stagingContainer);
    return pdfBlob;
  } catch (err) {
    if (document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
    throw err;
  }
}

// ==========================================================================
// WHATSAPP PDF GENERATION & SHARING
// ==========================================================================

async function sharePdfViaWhatsApp() {
  const q = appState.currentQuote;
  showToast("Generating Quotation PDF for WhatsApp...", "info");

  const safeCustomer = (q.customerName || 'Customer').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
  const filename = `QN-${q.quoteNo}-${safeCustomer}.pdf`;

  try {
    const pdfBlob = await generateA4PdfBlob(filename);
    const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

    let phone = (q.customerPhone || q.contactNo || '').replace(/[^0-9]/g, '');
    if (phone.startsWith('05')) {
      phone = '971' + phone.substring(1);
    }

    // 1. If mobile device supports Web Share API with files (Android / iOS)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      await navigator.share({
        files: [pdfFile],
        title: `Quotation #${q.quoteNo}`,
        text: `Quotation #${q.quoteNo} - ${q.customerName || ''} from TAJ FLYSCREEN`
      });
      showToast("PDF shared to WhatsApp!");
      return;
    }

    // 2. Desktop Fallback: Download the exact A4 PDF and launch WhatsApp Web
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

    const messageText = `Quotation #${q.quoteNo} for ${q.customerName || 'Valued Customer'}. The quotation PDF (${filename}) has been downloaded. Please drag and drop it here to send.`;
    const waUrl = phone 
      ? `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(messageText)}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

    window.open(waUrl, '_blank');
    showToast(`PDF downloaded (${filename})! Please attach it in WhatsApp chat.`, "success");

  } catch (err) {
    console.error('Error generating PDF:', err);
    showToast("Error generating PDF. Opening print dialog.", "info");
    window.print();
  }
}

async function downloadPdfDirectly() {
  const q = appState.currentQuote;
  showToast("Preparing identical A4 PDF download...", "info");

  const safeCustomer = (q.customerName || 'Customer').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
  const filename = `QN-${q.quoteNo}-${safeCustomer}.pdf`;

  try {
    const pdfBlob = await generateA4PdfBlob(filename);
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
    showToast(`Downloaded: ${filename}`);
  } catch (err) {
    console.error('Error downloading PDF:', err);
    showToast("Falling back to browser print...", "info");
    window.print();
  }
}

// ==========================================================================
// QUOTE MANAGEMENT (CREATE, SAVE, CLONE, DELETE)
// ==========================================================================

function createNewQuote() {
  const nextNo = getNextQuoteNumber();
  const todayStr = formatDocDate(new Date());

  appState.currentQuote = {
    id: "quote_" + Date.now(),
    quoteNo: String(nextNo),
    quoteDate: todayStr,
    lpoNo: "",
    lpoDate: "",
    salesman: appState.currentQuote.salesman || "",
    paymentTerms: appState.currentQuote.paymentTerms || "",
    customerName: "",
    customerVatin: "",
    customerPhone: "",
    contactPerson: "",
    contactNo: "",
    customerAddress: "",
    items: [
      {
        no: 1,
        code: "",
        description: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
        notes: "TOP TO BOTTOM",
        width: 1000,
        height: 1000,
        qty: 1,
        unit: "SQMTR",
        totSqm: 1.00,
        rate: 140.00,
        amount: 140.00,
        manualTotSqm: false,
        manualAmount: false
      }
    ],
    discount1: 0,
    discount2: 0,
    vatRate: 5,
    roundOff: 0,
    amountInWords: "",
    remarks: "",
    updatedAt: new Date().toISOString()
  };

  initFormInputs();
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  switchView('editor');
  showToast(`Created New Quotation #${nextNo}`);
}

function getNextQuoteNumber() {
  let highest = 668;
  appState.savedQuotes.forEach(q => {
    const num = parseInt(q.quoteNo, 10);
    if (!isNaN(num) && num > highest) highest = num;
  });
  return highest + 1;
}

function formatDocDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = String(date.getDate()).padStart(2, '0');
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

function saveCurrentQuote(explicit = false) {
  const q = appState.currentQuote;
  q.updatedAt = new Date().toISOString();

  const idx = appState.savedQuotes.findIndex(item => item.id === q.id);
  if (idx !== -1) {
    appState.savedQuotes[idx] = JSON.parse(JSON.stringify(q));
  } else {
    appState.savedQuotes.unshift(JSON.parse(JSON.stringify(q)));
  }

  saveQuotesToStorage();
  if (explicit) {
    showToast(`Quotation #${q.quoteNo} saved successfully!`);
  }
}

function loadQuoteById(id) {
  const quote = appState.savedQuotes.find(q => q.id === id);
  if (!quote) return;

  appState.currentQuote = JSON.parse(JSON.stringify(quote));
  initFormInputs();
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  closeSavedQuotesModal();
  showToast(`Loaded Quotation #${quote.quoteNo}`);
}

function cloneQuote(id, e) {
  if (e) e.stopPropagation();
  const quote = appState.savedQuotes.find(q => q.id === id);
  if (!quote) return;

  const nextNo = getNextQuoteNumber();
  const cloned = JSON.parse(JSON.stringify(quote));
  cloned.id = "quote_" + Date.now();
  cloned.quoteNo = String(nextNo);
  cloned.quoteDate = formatDocDate(new Date());
  cloned.updatedAt = new Date().toISOString();

  appState.savedQuotes.unshift(cloned);
  saveQuotesToStorage();
  loadQuoteById(cloned.id);
  showToast(`Cloned to New Quotation #${nextNo}`);
}

function deleteQuote(id, e) {
  if (e) e.stopPropagation();
  if (appState.savedQuotes.length <= 1) {
    showToast("Cannot delete the only remaining quotation", "info");
    return;
  }
  if (!confirm("Are you sure you want to delete this quotation?")) return;

  appState.savedQuotes = appState.savedQuotes.filter(q => q.id !== id);
  saveQuotesToStorage();
  renderSavedQuotesList();
  showToast("Quotation deleted");
}

function loadSampleTemplate() {
  appState.currentQuote = JSON.parse(JSON.stringify(SAMPLE_QUOTE));
  initFormInputs();
  renderItemsTable();
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  showToast("Loaded original sample quotation template");
}

// ==========================================================================
// SAVED QUOTES MODAL & BACKUP
// ==========================================================================

function openSavedQuotesModal() {
  renderSavedQuotesList();
  const modal = document.getElementById('savedQuotesModal');
  if (modal) modal.style.display = 'flex';
}

function closeSavedQuotesModal() {
  const modal = document.getElementById('savedQuotesModal');
  if (modal) modal.style.display = 'none';
}

function renderSavedQuotesList(filter = '') {
  const listEl = document.getElementById('savedQuotesList');
  if (!listEl) return;

  listEl.innerHTML = '';
  const filtered = appState.savedQuotes.filter(q => {
    if (!filter) return true;
    const term = filter.toLowerCase();
    return (q.quoteNo || '').toLowerCase().includes(term) ||
           (q.customerName || '').toLowerCase().includes(term) ||
           (q.contactPerson || '').toLowerCase().includes(term);
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No quotations found.</div>`;
    return;
  }

  filtered.forEach(q => {
    const isCurrent = q.id === appState.currentQuote.id;
    const itemEl = document.createElement('div');
    itemEl.className = 'saved-quote-item';
    itemEl.onclick = () => loadQuoteById(q.id);
    itemEl.innerHTML = `
      <div class="quote-item-meta">
        <span class="quote-item-title">#${q.quoteNo} - ${escapeHtml(q.customerName || 'Untitled Client')}</span>
        <span class="quote-item-sub">Date: ${q.quoteDate} | Items: ${q.items ? q.items.length : 0} | ${isCurrent ? '<strong style="color: var(--color-success);">(Active)</strong>' : ''}</span>
      </div>
      <div class="quote-item-actions">
        <button class="btn btn-sm btn-secondary" onclick="cloneQuote('${q.id}', event)" title="Duplicate / Clone">Clone</button>
        <button class="btn btn-sm btn-danger" onclick="deleteQuote('${q.id}', event)" title="Delete">&times;</button>
      </div>
    `;
    listEl.appendChild(itemEl);
  });
}

function filterSavedQuotes(query) {
  renderSavedQuotesList(query);
}

function exportQuotesBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState.savedQuotes, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `TAJ_QUOTATIONS_BACKUP_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Backup exported successfully!");
}

function importQuotesBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported) && imported.length > 0) {
        appState.savedQuotes = imported;
        saveQuotesToStorage();
        renderSavedQuotesList();
        showToast(`Imported ${imported.length} quotations!`);
      } else {
        alert("Invalid backup format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// QUICK CLIENT AUTOCOMPLETE
// ==========================================================================

function populateCustomerPresets() {
  const select = document.getElementById('quickCustomerSelect');
  if (!select) return;

  const uniqueClients = {};
  appState.savedQuotes.forEach(q => {
    if (q.customerName && q.customerName.trim()) {
      uniqueClients[q.customerName.trim()] = {
        name: q.customerName,
        phone: q.customerPhone || '',
        vatin: q.customerVatin || '',
        contactPerson: q.contactPerson || '',
        contactNo: q.contactNo || '',
        address: q.customerAddress || ''
      };
    }
  });

  select.innerHTML = '<option value="">Quick Select Saved Client...</option>';
  Object.keys(uniqueClients).forEach(clientKey => {
    const opt = document.createElement('option');
    opt.value = clientKey;
    opt.textContent = clientKey;
    select.appendChild(opt);
  });
}

function applySavedCustomer(clientKey) {
  if (!clientKey) return;
  const quote = appState.savedQuotes.find(q => (q.customerName || '').trim() === clientKey);
  if (!quote) return;

  updateField('customerName', quote.customerName);
  updateField('customerPhone', quote.customerPhone || '');
  updateField('customerVatin', quote.customerVatin || '');
  updateField('contactPerson', quote.contactPerson || '');
  updateField('contactNo', quote.contactNo || '');
  updateField('customerAddress', quote.customerAddress || '');

  setVal('custName', quote.customerName);
  setVal('custPhone', quote.customerPhone || '');
  setVal('custVatin', quote.customerVatin || '');
  setVal('custContactPerson', quote.contactPerson || '');
  setVal('custContactNo', quote.contactNo || '');
  setVal('custAddress', quote.customerAddress || '');

  showToast(`Filled details for: ${clientKey}`);
}

// ==========================================================================
// COMPANY & BANK SETTINGS MODAL
// ==========================================================================

function openSettingsModal(defaultTab = 'company') {
  const s = appState.companySettings;
  setVal('setCompanyAddress', s.companyAddress);
  setVal('setTel', s.tel);
  setVal('setEmail', s.email);
  setVal('setWebsite', s.website);
  setVal('setLicenseNo', s.licenseNo);
  setVal('setTaxNo', s.taxNo);
  setVal('setBankAccName', s.bankAccName);
  setVal('setBankAccNo', s.bankAccNo);
  setVal('setBankIban', s.bankIban);
  setVal('setBankName', s.bankName);

  switchSettingsTab(defaultTab);

  const modal = document.getElementById('settingsModal');
  if (modal) modal.style.display = 'flex';
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.style.display = 'none';
}

function saveSettingsFromModal() {
  const s = appState.companySettings;
  s.companyAddress = document.getElementById('setCompanyAddress')?.value || '';
  s.tel = document.getElementById('setTel')?.value || '';
  s.email = document.getElementById('setEmail')?.value || '';
  s.website = document.getElementById('setWebsite')?.value || '';
  s.licenseNo = document.getElementById('setLicenseNo')?.value || '';
  s.taxNo = document.getElementById('setTaxNo')?.value || '';
  s.bankAccName = document.getElementById('setBankAccName')?.value || '';
  s.bankAccNo = document.getElementById('setBankAccNo')?.value || '';
  s.bankIban = document.getElementById('setBankIban')?.value || '';
  s.bankName = document.getElementById('setBankName')?.value || '';

  try {
    localStorage.setItem('taj_company_settings', JSON.stringify(s));
  } catch (err) {
    console.error('Failed saving company settings:', err);
  }

  updateLiveDocument();
  closeSettingsModal();
  showToast("Company & Bank settings updated!");
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// ==========================================================================
// SMART CALCULATOR & AREA ESTIMATOR (CUSTOM FOR TAJ FLYSCREEN)
// ==========================================================================

let pocketCalcState = {
  current: "0",
  previous: null,
  op: null,
  overwrite: true,
  memory: 0
};

function openCalculatorModal(tab = 'area') {
  initCalcProductSelect();
  runAreaCalculator();

  // Pre-fill discount calculator base amount from current quote subtotal
  const baseAmtInput = document.getElementById('discCalcBaseAmt');
  if (baseAmtInput) {
    const subtotal = appState.currentQuote.calculated ? appState.currentQuote.calculated.subtotalAmount : 0;
    baseAmtInput.value = subtotal > 0 ? subtotal.toFixed(2) : '1000';
    runDiscountCalc('percent');
  }

  switchCalcTab(tab);

  const modal = document.getElementById('calculatorModal');
  if (modal) modal.style.display = 'flex';
}

function closeCalculatorModal() {
  const modal = document.getElementById('calculatorModal');
  if (modal) modal.style.display = 'none';
}

function switchCalcTab(tabName) {
  const areaTab = document.getElementById('calcAreaTab');
  const standardTab = document.getElementById('calcStandardTab');
  const discountTab = document.getElementById('calcDiscountTab');

  const btnArea = document.getElementById('tabCalcArea');
  const btnStandard = document.getElementById('tabCalcStandard');
  const btnDiscount = document.getElementById('tabCalcDiscount');

  if (areaTab) areaTab.style.display = tabName === 'area' ? 'block' : 'none';
  if (standardTab) standardTab.style.display = tabName === 'standard' ? 'block' : 'none';
  if (discountTab) discountTab.style.display = tabName === 'discount' ? 'block' : 'none';

  btnArea?.classList.toggle('active', tabName === 'area');
  btnStandard?.classList.toggle('active', tabName === 'standard');
  btnDiscount?.classList.toggle('active', tabName === 'discount');
}

// --------------------------------------------------------------------------
// TAB 1: FLYSCREEN & AREA ESTIMATOR
// --------------------------------------------------------------------------

function initCalcProductSelect() {
  const select = document.getElementById('calcProdSelect');
  if (!select) return;

  select.innerHTML = '';
  appState.quickProducts.forEach((p, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${p.desc} (${p.rate} AED)`;
    select.appendChild(opt);
  });
}

function onCalcProductChange(idx) {
  const prod = appState.quickProducts[idx];
  if (!prod) return;

  const rateInput = document.getElementById('calcRateInput');
  if (rateInput) rateInput.value = prod.rate;
  runAreaCalculator();
}

function runAreaCalculator() {
  const w = parseFloat(document.getElementById('calcWidthInput')?.value) || 0;
  const h = parseFloat(document.getElementById('calcHeightInput')?.value) || 0;
  const qty = parseFloat(document.getElementById('calcQtyInput')?.value) || 1;
  const rate = parseFloat(document.getElementById('calcRateInput')?.value) || 0;
  const minRule = parseFloat(document.getElementById('calcMinAreaSelect')?.value) || 0;

  // Exact calculations
  const exactPieceSqm = (w * h) / 1000000;
  const billedPieceSqm = Math.max(exactPieceSqm, minRule);
  const totalBilledSqm = Math.round(billedPieceSqm * qty * 100) / 100;
  const pieceSqft = exactPieceSqm * 10.7639;
  const pieceRm = (2 * (w + h)) / 1000;

  const subtotal = Math.round(totalBilledSqm * rate * 100) / 100;
  const vat = Math.round(subtotal * 0.05 * 100) / 100;
  const netWithVat = Math.round((subtotal + vat) * 100) / 100;

  setText('resPieceSqm', `${exactPieceSqm.toFixed(2)} SqM`);
  setText('resPieceSqft', `${pieceSqft.toFixed(2)} SqFt`);
  setText('resPieceRm', `${pieceRm.toFixed(2)} RM`);

  setText('resTotalBillSqm', `${totalBilledSqm.toFixed(2)} SqM ${minRule > exactPieceSqm ? `(Min ${minRule} applied)` : ''}`);
  setText('resSubtotalAmt', `${subtotal.toFixed(2)} AED`);
  setText('resVatAmt', `${vat.toFixed(2)} AED`);
  setText('resNetWithVat', `${netWithVat.toFixed(2)} AED`);
}

function insertCalcItemToQuotation() {
  const selIdx = document.getElementById('calcProdSelect')?.value;
  const prod = appState.quickProducts[selIdx] || {
    desc: "SINGLE OPEN PLEATED FLYSCREEN BLACK",
    notes: "TOP TO BOTTOM",
    rate: 140,
    unit: "SQMTR"
  };

  const w = parseFloat(document.getElementById('calcWidthInput')?.value) || 1000;
  const h = parseFloat(document.getElementById('calcHeightInput')?.value) || 1000;
  const qty = parseFloat(document.getElementById('calcQtyInput')?.value) || 1;
  const rate = parseFloat(document.getElementById('calcRateInput')?.value) || prod.rate;
  const minRule = parseFloat(document.getElementById('calcMinAreaSelect')?.value) || 0;

  const exactPieceSqm = (w * h) / 1000000;
  const billedPieceSqm = Math.max(exactPieceSqm, minRule);
  const totalBilledSqm = Math.round(billedPieceSqm * qty * 100) / 100;
  const amount = Math.round(totalBilledSqm * rate * 100) / 100;

  const items = appState.currentQuote.items;
  items.push({
    no: items.length + 1,
    code: "",
    description: prod.desc,
    notes: prod.notes || "TOP TO BOTTOM",
    width: w,
    height: h,
    qty: qty,
    unit: "SQMTR",
    totSqm: totalBilledSqm,
    rate: rate,
    amount: amount,
    manualTotSqm: minRule > exactPieceSqm,
    manualAmount: true
  });

  recalculateAll();
  renderItemsTable();
  updateLiveDocument();
  autoSaveActiveQuote();
  closeCalculatorModal();
  showToast(`Added '${prod.desc}' (${totalBilledSqm.toFixed(2)} SqM) to quotation!`);
}

// --------------------------------------------------------------------------
// TAB 2: POCKET DIGITAL ARITHMETIC CALCULATOR
// --------------------------------------------------------------------------

function pocketCalcUpdateDisplay() {
  const screen = document.getElementById('pocketCalcScreen');
  const history = document.getElementById('pocketCalcHistory');

  if (screen) screen.textContent = pocketCalcState.current;
  if (history) {
    if (pocketCalcState.previous !== null && pocketCalcState.op) {
      const opSymbol = { '/': '÷', '*': '×', '+': '+', '-': '-' }[pocketCalcState.op] || pocketCalcState.op;
      history.textContent = `${pocketCalcState.previous} ${opSymbol}`;
    } else {
      history.innerHTML = '&nbsp;';
    }
  }
}

function pocketCalcNum(digit) {
  if (pocketCalcState.overwrite) {
    pocketCalcState.current = digit === '.' ? '0.' : digit;
    pocketCalcState.overwrite = false;
  } else {
    if (digit === '.' && pocketCalcState.current.includes('.')) return;
    if (pocketCalcState.current === '0' && digit !== '.') {
      pocketCalcState.current = digit;
    } else {
      pocketCalcState.current += digit;
    }
  }
  pocketCalcUpdateDisplay();
}

function pocketCalcOp(op) {
  const currentNum = parseFloat(pocketCalcState.current);

  if (pocketCalcState.previous === null) {
    pocketCalcState.previous = currentNum;
  } else if (!pocketCalcState.overwrite) {
    pocketCalcEquals();
    pocketCalcState.previous = parseFloat(pocketCalcState.current);
  }

  pocketCalcState.op = op;
  pocketCalcState.overwrite = true;
  pocketCalcUpdateDisplay();
}

function pocketCalcEquals() {
  if (pocketCalcState.previous === null || pocketCalcState.op === null) return;

  const prev = pocketCalcState.previous;
  const current = parseFloat(pocketCalcState.current);
  let res = 0;

  switch (pocketCalcState.op) {
    case '+': res = prev + current; break;
    case '-': res = prev - current; break;
    case '*': res = prev * current; break;
    case '/': res = current !== 0 ? prev / current : 'Error'; break;
  }

  if (res !== 'Error') {
    res = Math.round(res * 10000) / 10000;
  }

  pocketCalcState.current = String(res);
  pocketCalcState.previous = null;
  pocketCalcState.op = null;
  pocketCalcState.overwrite = true;
  pocketCalcUpdateDisplay();
}

function pocketCalcAction(act) {
  switch (act) {
    case 'C':
      pocketCalcState.current = '0';
      pocketCalcState.previous = null;
      pocketCalcState.op = null;
      pocketCalcState.overwrite = true;
      break;
    case 'BACK':
      if (pocketCalcState.current.length > 1) {
        pocketCalcState.current = pocketCalcState.current.slice(0, -1);
      } else {
        pocketCalcState.current = '0';
        pocketCalcState.overwrite = true;
      }
      break;
    case 'PERCENT':
      pocketCalcState.current = String(parseFloat(pocketCalcState.current) / 100);
      pocketCalcState.overwrite = true;
      break;
    case 'NEG':
      pocketCalcState.current = String(-parseFloat(pocketCalcState.current));
      break;
    case 'M+':
      pocketCalcState.memory += parseFloat(pocketCalcState.current) || 0;
      showToast(`Memory: ${pocketCalcState.memory}`);
      break;
    case 'M-':
      pocketCalcState.memory -= parseFloat(pocketCalcState.current) || 0;
      showToast(`Memory: ${pocketCalcState.memory}`);
      break;
    case 'MR':
      pocketCalcState.current = String(pocketCalcState.memory);
      pocketCalcState.overwrite = true;
      break;
    case 'MC':
      pocketCalcState.memory = 0;
      showToast("Memory Cleared");
      break;
  }
  pocketCalcUpdateDisplay();
}

function pocketCalcCopy() {
  navigator.clipboard.writeText(pocketCalcState.current);
  showToast(`Copied ${pocketCalcState.current} to clipboard!`);
}

function pocketCalcPasteToDiscount() {
  const val = parseFloat(pocketCalcState.current) || 0;
  appState.currentQuote.discount1 = val;
  setVal('discount1', val);
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  closeCalculatorModal();
  showToast(`Applied ${val.toFixed(2)} AED discount to quotation!`);
}

// --------------------------------------------------------------------------
// TAB 3: DISCOUNT & MARGIN CALCULATOR
// --------------------------------------------------------------------------

function runDiscountCalc(source = 'percent') {
  const base = parseFloat(document.getElementById('discCalcBaseAmt')?.value) || 0;
  const pctInput = document.getElementById('discCalcPercent');
  const amtInput = document.getElementById('discCalcAmt');
  const vatRate = parseFloat(document.getElementById('discCalcVatSelect')?.value) || 0;

  let pct = parseFloat(pctInput?.value) || 0;
  let amt = parseFloat(amtInput?.value) || 0;

  if (source === 'percent') {
    amt = Math.round(base * (pct / 100) * 100) / 100;
    if (amtInput) amtInput.value = amt.toFixed(2);
  } else {
    pct = base > 0 ? Math.round((amt / base) * 1000) / 10 : 0;
    if (pctInput) pctInput.value = pct.toFixed(1);
  }

  const beforeVat = Math.max(0, base - amt);
  const vat = Math.round(beforeVat * (vatRate / 100) * 100) / 100;
  const net = Math.round((beforeVat + vat) * 100) / 100;

  setText('resDiscOriginal', `${base.toFixed(2)} AED`);
  setText('resDiscSavings', `- ${amt.toFixed(2)} AED (${pct.toFixed(1)}%)`);
  setText('resDiscBeforeVat', `${beforeVat.toFixed(2)} AED`);
  setText('resDiscVat', `${vat.toFixed(2)} AED`);
  setText('resDiscNet', `${net.toFixed(2)} AED`);
}

function applyQuickDiscountPercent(pct) {
  const pctInput = document.getElementById('discCalcPercent');
  if (pctInput) pctInput.value = pct;
  runDiscountCalc('percent');
}

function applyCalculatedDiscountToQuote() {
  const amt = parseFloat(document.getElementById('discCalcAmt')?.value) || 0;
  appState.currentQuote.discount1 = amt;
  setVal('discount1', amt);
  recalculateAll();
  updateLiveDocument();
  autoSaveActiveQuote();
  closeCalculatorModal();
  showToast(`Applied ${amt.toFixed(2)} AED discount to quotation!`);
}
