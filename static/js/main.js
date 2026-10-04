/**
 * Dadonia Import & Export - Vanilla JS Utilities & Interactive Systems
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Auto-dismiss or allow closing of message alerts
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(function(alert) {
    alert.style.cursor = 'pointer';
    alert.title = 'انقر للإغلاق';
    alert.addEventListener('click', function() {
      alert.style.opacity = '0';
      setTimeout(function() {
        alert.remove();
      }, 200);
    });
  });

  // 2. Technical Drawer Toggles on Product Cards
  document.querySelectorAll('.tech-details-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const drawer = this.nextElementSibling;
      if (drawer && drawer.classList.contains('tech-drawer')) {
        const isOpen = drawer.classList.contains('open');
        drawer.classList.toggle('open');
        this.setAttribute('aria-expanded', !isOpen);
        this.innerHTML = isOpen
          ? 'المواصفات الفنية المعتمدة (HS / درجة الحفظ / المعايرة) ↓'
          : 'إخفاء المواصفات الفنية ↑';
      }
    });
  });

  // 3. Interactive Container & Reefer Payload Calculator
  initReeferCalculator();
});

/**
 * Interactive Reefer & Container Freight Calculator
 */
function initReeferCalculator() {
  const cropSelect = document.getElementById('calc-crop');
  const containerSelect = document.getElementById('calc-container');
  const portSelect = document.getElementById('calc-port');

  if (!cropSelect || !containerSelect || !portSelect) return;

  const data = {
    citrus: {
      name: 'برتقال صيفي فالنسيا (Valencia Oranges)',
      temp: '+3°C إلى +5°C',
      vent: '25 م³/ساعة (Fresh Air)',
      weightPerCarton: 15,
      palletLoad: 80, // cartons per pallet
      palletsPer40: 20,
      palletsPer20: 10,
      notes: 'معايرة أحجام 48-100 مم، عبوات تلسكوبية مهواة.',
    },
    dates: {
      name: 'تمور مجدول فاخرة (Medjool Dates)',
      temp: '0°C إلى +4°C (أو -18°C للتخزين)',
      vent: 'مغلق (Vent Closed)',
      weightPerCarton: 5,
      palletLoad: 200,
      palletsPer40: 20,
      palletsPer20: 10,
      notes: 'رطوبة 18-22%، كراتين تصديرية 5 كجم.',
    },
    onions: {
      name: 'بصل أحمر وذهبي جاف (Dry Onions)',
      temp: '+2°C إلى +4°C (تهوية مستمرة)',
      vent: '35 م³/ساعة (Dehumidification)',
      weightPerCarton: 25, // 25kg bags
      palletLoad: 40,
      palletsPer40: 24,
      palletsPer20: 11,
      notes: 'أكياس رافيا شبكية 25 كجم مهواة على بالتات معقمة.',
    },
    strawberries: {
      name: 'فراولة مجمدة IQF (Frozen Strawberries)',
      temp: '-18°C إلى -20°C تجميد دائم',
      vent: 'مغلق تماماً (Vent Closed)',
      weightPerCarton: 10,
      palletLoad: 90,
      palletsPer40: 22,
      palletsPer20: 10,
      notes: 'أكياس بوليثين أزرق 10 كجم معقمة ومجمدة فورياً.',
    },
    cotton: {
      name: 'قطن مصري جيزة 94 (Giza 94 Cotton)',
      temp: 'درجة حرارة الغرفة (حاوية جافة)',
      vent: 'تهوية طبيعية جافة',
      weightPerCarton: 227, // bale kg
      palletLoad: 1,
      palletsPer40: 98, // bales
      palletsPer20: 48,
      notes: 'بالات مكبوسة ومحزمة بأسلاك صلب ومغطاة بقماش قطني.',
    },
    minerals: {
      name: 'كربونات الكالسيوم والمعادن (Industrial Minerals)',
      temp: 'حاوية جافة قياسية (Heavy Payload)',
      vent: 'عادي',
      weightPerCarton: 1000, // 1 ton jumbo bag
      palletLoad: 1,
      palletsPer40: 26,
      palletsPer20: 22,
      notes: 'أكياس جامبو 1 طن إلى 1.25 طن على قواعد خشبية.',
    }
  };

  const ports = {
    rotterdam: { name: 'ميناء روتردام (هولندا)', days: '7 - 9 أيام' },
    hamburg: { name: 'ميناء هامبورغ (ألمانيا)', days: '8 - 10 أيام' },
    felixstowe: { name: 'ميناء فيلكستو (المملكة المتحدة)', days: '9 - 11 يوماً' },
    novorossiysk: { name: 'ميناء نوفوروسيسك (روسيا)', days: '5 - 7 أيام' },
    jeddah: { name: 'ميناء جدة الإسلامي (السعودية)', days: '3 - 4 أيام' },
    jebel_ali: { name: 'ميناء جبل علي (الإمارات)', days: '6 - 8 أيام' },
    singapore: { name: 'ميناء سنغافورة (سنغافورة)', days: '16 - 19 يوماً' },
  };

  function update() {
    const cropKey = cropSelect.value;
    const contType = containerSelect.value;
    const portKey = portSelect.value;

    const crop = data[cropKey] || data.citrus;
    const port = ports[portKey] || ports.rotterdam;

    const is40 = contType.includes('40');
    const pallets = is40 ? crop.palletsPer40 : crop.palletsPer20;
    const totalPackages = pallets * crop.palletLoad;
    const totalWeightTons = ((totalPackages * crop.weightPerCarton) / 1000).toFixed(1);

    // Update UI elements
    const metricPayload = document.getElementById('calc-res-payload');
    const metricCount = document.getElementById('calc-res-count');
    const metricTemp = document.getElementById('calc-res-temp');
    const metricTransit = document.getElementById('calc-res-transit');
    const metricNotes = document.getElementById('calc-res-notes');
    const ctaBtn = document.getElementById('calc-cta-btn');

    if (metricPayload) metricPayload.textContent = totalWeightTons + ' طن متري';
    if (metricCount) metricCount.textContent = totalPackages.toLocaleString('ar-EG') + ' طرد / بالتة';
    if (metricTemp) metricTemp.textContent = crop.temp;
    if (metricTransit) metricTransit.textContent = port.days;
    if (metricNotes) metricNotes.textContent = crop.notes + ' • التهوية: ' + crop.vent;

    if (ctaBtn) {
      const summaryMsg = encodeURIComponent(
        `طلب استفسار رسمي بناء على حاسبة الحمولات:\n` +
        `- المحصول: ${crop.name}\n` +
        `- نوع الحاوية: ${containerSelect.options[containerSelect.selectedIndex].text}\n` +
        `- ميناء الوصول: ${port.name}\n` +
        `- الحمولة المقدرة: ${totalWeightTons} طن (${totalPackages} عبوة)\n` +
        `- درجة الحفظ المطلوبة: ${crop.temp}`
      );
      ctaBtn.href = `/contact/?message=${summaryMsg}`;
    }
  }

  cropSelect.addEventListener('change', update);
  containerSelect.addEventListener('change', update);
  portSelect.addEventListener('change', update);

  update();
}
