(() => {
  const translations = {
    en: {
      operations:'OPERATIONS',dashboard:'Dashboard',alerts:'Alerts',inventory:'Inventory',products:'Products',planning:'PLANNING',forecast:'AI forecast',purchaseOrders:'Purchase orders',suppliers:'Suppliers',reports:'Reports',initials:'WM',managerName:'Warehouse Manager',managerRole:'Manager',back:'Back',pageTitle:'Search',searchBy:'SEARCH BY',allFields:'All fields',companyName:'Company name',product:'Product',productName:'Product name',product1:'product 1',product2:'product 2',product3:'product 3',sku:'SKU',purchaseOrder:'Purchase order',orderNumber:'Order number',category:'Category',view:'View',companyOrder:'Company name · 400 units on order',scheduledDelivery:'Company name · Delivery scheduled',order1048:'Company name · Product 1 · 400 units · Expected 18 Oct',order1050:'Company name · Product 2 · 200 units · Expected 21 Oct',arriving:'Arriving',scheduled:'Scheduled',noResults:'No results found. Try another search.',copyright:'© 2027 Smart Warehouse. All rights reserved.',close:'Close',notifications:'No new notifications',backNotice:'Back to the previous page',searchSummary:'Showing results for',in:'in',results:'results',details:'Details',notFound:'No matching records found.',activeUsers:'Active users',signedInWebsite:'Signed in to the website',online:'online',employee:'Employee',merchant:'Merchant',activeEightAgo:'Active 8 min ago',admin:'Admin',signOut:'Sign out'
    },
    ar: {
      operations:'العمليات',dashboard:'لوحة التحكم',alerts:'التنبيهات',inventory:'المخزون',products:'المنتجات',planning:'التخطيط',forecast:'توقعات الذكاء الاصطناعي',purchaseOrders:'أوامر الشراء',suppliers:'الموردون',reports:'التقارير',initials:'م ا',managerName:'مدير المخزن',managerRole:'مدير',back:'رجوع',pageTitle:'بحث',searchBy:'البحث حسب',allFields:'كل الحقول',companyName:'اسم الشركة',product:'المنتج',productName:'اسم المنتج',product1:'منتج ١',product2:'منتج ٢',product3:'منتج ٣',sku:'SKU',purchaseOrder:'أمر الشراء',orderNumber:'رقم الطلب',category:'الفئة',view:'عرض',companyOrder:'اسم الشركة · ٤٠٠ وحدة في الطلب',scheduledDelivery:'اسم الشركة · تم تحديد موعد التسليم',order1048:'اسم الشركة · المنتج ١ · ٤٠٠ وحدة · متوقع ١٨ أكتوبر',order1050:'اسم الشركة · المنتج ٢ · ٢٠٠ وحدة · متوقع ٢١ أكتوبر',arriving:'قيد الوصول',scheduled:'مجدول',noResults:'لا توجد نتائج. جرّب بحثًا آخر.',copyright:'© 2027 Smart Warehouse. جميع الحقوق محفوظة.',close:'إغلاق',notifications:'لا توجد إشعارات جديدة',backNotice:'العودة إلى الصفحة السابقة',searchSummary:'نتائج البحث عن',in:'في',results:'نتائج',details:'التفاصيل',notFound:'لا توجد سجلات مطابقة.',activeUsers:'المستخدمون النشطون',signedInWebsite:'مسجلون في الموقع',online:'متصلون',employee:'موظف',merchant:'تاجر',activeEightAgo:'نشط منذ ٨ دقائق',admin:'مدير',signOut:'تسجيل الخروج'
    }
  };
  let lang = localStorage.getItem('dashboard-search-language') || 'en';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const text = key => translations[lang][key] || translations.en[key] || key;
  const searchFields = [
    {value:'all',key:'allFields'},
    {value:'product',key:'productName'},
    {value:'sku',key:'sku'},
    {value:'company',key:'companyName'},
    {value:'order',key:'orderNumber'},
    {value:'category',key:'category'}
  ];
  const searchByButton = $('#searchByButton');
  const searchByMenu = $('#searchByMenu');
  const toast = $('#toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }
  function localize() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = `${text('pageTitle')} · Smart Warehouse`;
    $$('[data-i18n]').forEach(node => { node.textContent = text(node.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', text(node.dataset.i18nAria)); });
    const numberFormat = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {useGrouping:false});
    $$('[data-localized-number]').forEach(node => {
      const value = Number(node.dataset.localizedNumber);
      node.textContent = lang === 'ar' ? numberFormat.format(value) : String(value);
    });
    $$('[data-lang]').forEach(button => button.classList.toggle('selected', button.dataset.lang === lang));
    $('#searchInput').placeholder = lang === 'ar' ? 'ابحث عن المنتجات والشركات والطلبات...' : 'Search products, companies, orders...';
    $('#searchByValue').textContent = text(searchFields.find(field => field.value === searchByButton.dataset.field)?.key || 'companyName');
    renderSearchByMenu();
    updateSummary();
  }
  function renderSearchByMenu() {
    searchByMenu.replaceChildren(...searchFields.map(field => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'search-by-option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(searchByButton.dataset.field === field.value));
      option.dataset.field = field.value;
      const label = document.createElement('span');
      label.textContent = text(field.key);
      const check = document.createElement('span');
      check.className = 'search-by-check';
      check.setAttribute('aria-hidden', 'true');
      check.textContent = searchByButton.dataset.field === field.value ? '✓' : '';
      option.append(label, check);
      option.addEventListener('click', () => {
        searchByButton.dataset.field = field.value;
        $('#searchByValue').textContent = text(field.key);
        closeSearchByMenu();
        runSearch();
        searchByButton.focus();
      });
      return option;
    }));
  }
  function closeSearchByMenu() {
    searchByMenu.hidden = true;
    searchByButton.setAttribute('aria-expanded', 'false');
  }
  searchByButton.addEventListener('click', event => {
    event.stopPropagation();
    const open = searchByMenu.hidden;
    searchByMenu.hidden = !open;
    searchByButton.setAttribute('aria-expanded', String(open));
    if (open) renderSearchByMenu();
  });
  searchByMenu.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', event => {
    if (!event.target.closest('.field-select-wrap')) closeSearchByMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !searchByMenu.hidden) {
      closeSearchByMenu();
      searchByButton.focus();
    }
  });
  function getFieldLabel() {
    const field = searchFields.find(option => option.value === searchByButton.dataset.field);
    return text(field?.key || 'allFields');
  }
  function formatNumber(value) {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(value);
  }
  function updateSummary(countText) {
    const query = $('#searchInput').value.trim();
    const shownQuery = query ? `“${query}”` : (lang === 'ar' ? 'كل العناصر' : 'all items');
    const activeFieldLabel = $('#searchInput').dataset.hasSearched === 'true' ? getFieldLabel() : text('allFields');
    const summary = $('#resultsSummary');
    summary.replaceChildren(document.createTextNode(`${text('searchSummary')} `));
    const queryNode = document.createElement('strong');
    queryNode.textContent = shownQuery;
    summary.append(queryNode, document.createTextNode(lang === 'ar' ? ` في ` : ` ${text('in')} `));
    const fieldNode = document.createElement('b');
    fieldNode.textContent = activeFieldLabel;
    summary.append(fieldNode, document.createTextNode(` · ${countText ?? (lang === 'ar' ? '1٬254' : '1,254')} ${text('results')}`));
  }
  function runSearch() {
    $('#searchInput').dataset.hasSearched = 'true';
    const query = $('#searchInput').value.trim().toLocaleLowerCase(lang === 'ar' ? 'ar' : 'en');
    const selectedField = searchByButton.dataset.field;
    let visibleCount = 0;
    $$('.result-row').forEach(row => {
      const searchable = `${row.dataset.search || ''} ${row.textContent}`.toLocaleLowerCase(lang === 'ar' ? 'ar' : 'en');
      const matchesField = selectedField === 'all'
        || (selectedField === 'company' && searchable.includes('company name'))
        || (selectedField === 'product' && (row.dataset.kind === 'product' || searchable.includes('product ')))
        || (selectedField === 'sku' && searchable.includes('sku-'))
        || (selectedField === 'order' && row.dataset.kind === 'order')
        || (selectedField === 'category' && row.dataset.kind === 'product');
      const matchesQuery = !query || searchable.includes(query);
      row.hidden = !(matchesField && matchesQuery);
      if (!row.hidden) visibleCount++;
    });
    $$('.result-card').forEach(card => {
      card.hidden = !$('.result-row:not([hidden])', card);
    });
    $('#emptyState').hidden = visibleCount > 0;
    $('#resultCount').textContent = formatNumber(visibleCount);
    updateSummary(formatNumber(visibleCount));
  }
  $('#searchInput').addEventListener('input', runSearch);
  $('#searchForm').addEventListener('submit', event => { event.preventDefault(); runSearch(); });
  $$('[data-lang]').forEach(button => button.addEventListener('click', () => {
    lang = button.dataset.lang;
    localStorage.setItem('dashboard-search-language', lang);
    localize();
  }));
  $('#notificationButton').addEventListener('click', () => showToast(text('notifications')));
  $('#backButton').addEventListener('click', () => {
    if (history.length > 1) history.back();
    else showToast(text('backNotice'));
  });
  const usersButton = $('#usersButton');
  const usersPopup = $('#usersPopup');
  const usersList = $('.active-users-list', usersPopup);
  const usersTrack = $('.users-custom-scrollbar', usersPopup);
  const usersThumb = $('.users-custom-scrollbar-thumb', usersTrack);
  function updateUsersScrollbar() {
    const maxScroll = usersList.scrollHeight - usersList.clientHeight;
    const trackHeight = usersTrack.clientHeight;
    if (maxScroll <= 1 || trackHeight <= 0) {
      usersTrack.hidden = true;
      return;
    }
    usersTrack.hidden = false;
    const thumbHeight = Math.max(22, trackHeight * usersList.clientHeight / usersList.scrollHeight);
    const travel = Math.max(0, trackHeight - thumbHeight);
    usersThumb.style.height = `${thumbHeight}px`;
    usersThumb.style.transform = `translateY(${travel * usersList.scrollTop / maxScroll}px)`;
  }
  function setUsersScrollFromPointer(event) {
    const rect = usersTrack.getBoundingClientRect();
    const thumbHeight = usersThumb.getBoundingClientRect().height;
    const travel = Math.max(1, rect.height - thumbHeight);
    const offset = Math.min(travel, Math.max(0, event.clientY - rect.top - thumbHeight / 2));
    usersList.scrollTop = offset / travel * (usersList.scrollHeight - usersList.clientHeight);
  }
  usersList.addEventListener('scroll', updateUsersScrollbar, {passive:true});
  window.addEventListener('resize', updateUsersScrollbar);
  usersTrack.addEventListener('pointerdown', event => {
    if (event.target === usersThumb) {
      event.preventDefault();
      usersThumb.setPointerCapture(event.pointerId);
      usersThumb.dataset.dragY = String(event.clientY);
      usersThumb.dataset.dragScroll = String(usersList.scrollTop);
      return;
    }
    setUsersScrollFromPointer(event);
  });
  usersThumb.addEventListener('pointermove', event => {
    if (!usersThumb.hasPointerCapture(event.pointerId)) return;
    const trackHeight = usersTrack.clientHeight;
    const thumbHeight = usersThumb.getBoundingClientRect().height;
    const travel = Math.max(1, trackHeight - thumbHeight);
    const scrollRange = usersList.scrollHeight - usersList.clientHeight;
    const delta = event.clientY - Number(usersThumb.dataset.dragY || 0);
    usersList.scrollTop = Number(usersThumb.dataset.dragScroll || 0) + delta / travel * scrollRange;
  });
  function closeUsersPopup() {
    usersPopup.hidden = true;
    usersPopup.setAttribute('aria-hidden', 'true');
    usersButton.setAttribute('aria-expanded', 'false');
  }
  usersButton.addEventListener('click', event => {
    event.stopPropagation();
    const opening = usersPopup.hidden;
    usersPopup.hidden = !opening;
    usersPopup.setAttribute('aria-hidden', String(!opening));
    usersButton.setAttribute('aria-expanded', String(opening));
    if (opening) requestAnimationFrame(updateUsersScrollbar);
  });
  usersPopup.addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', event => {
    if (!usersPopup.hidden && !usersPopup.contains(event.target) && !usersButton.contains(event.target)) closeUsersPopup();
  });
  $('.signout-button', usersPopup).addEventListener('click', closeUsersPopup);
  const modal = $('#resultModal');
  function closeModal() { modal.hidden = true; }
  $$('.view-button').forEach(button => button.addEventListener('click', () => {
    const row = button.closest('.result-row');
    const name = row.querySelector('.result-copy strong')?.textContent || button.dataset.view;
    $('#modalTitle').textContent = lang === 'ar' ? `تفاصيل ${name}` : `${text('details')}: ${name}`;
    $('#modalDescription').textContent = row.querySelector('.result-copy small')?.textContent || text('notFound');
    $('#modalIcon').textContent = row.querySelector('.result-icon').textContent.trim() || '▥';
    modal.hidden = false;
    $('#modalClose').focus();
  }));
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalOk').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeModal(); closeUsersPopup(); } });
  localize();
})();
