const scenarios = {
      low:  { price: 60000, cuts: 7,  days: 24, barbers: 2, base: 4000000, bonus: 6000,  overhead: 2500000 },
      mid:  { price: 65000, cuts: 10, days: 26, barbers: 3, base: 4000000, bonus: 8000,  overhead: 2500000 },
      high: { price: 70000, cuts: 15, days: 26, barbers: 4, base: 4000000, bonus: 10000, overhead: 2500000 },
    };

    function fmt(n) {
      const abs = Math.abs(n);
      const sign = n < 0 ? '-' : '';
      if (abs >= 1000000) return sign + 'Rp\u00a0' + (abs / 1000000).toFixed(1) + 'M';
      if (abs >= 1000)    return sign + 'Rp\u00a0' + Math.round(abs / 1000) + 'k';
      return sign + 'Rp\u00a0' + Math.round(abs);
    }

    function setScenario(s, btn) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      if (s !== 'custom' && scenarios[s]) {
        const sc = scenarios[s];
        document.getElementById('price').value    = sc.price;
        document.getElementById('cuts').value     = sc.cuts;
        document.getElementById('days').value     = sc.days;
        document.getElementById('barbers').value  = sc.barbers;
        document.getElementById('base').value     = sc.base;
        document.getElementById('bonus').value    = sc.bonus;
        document.getElementById('overhead').value = sc.overhead;
      }
      update();
    }

    function update() {
      const price    = +document.getElementById('price').value;
      const cuts     = +document.getElementById('cuts').value;
      const days     = +document.getElementById('days').value;
      const barbers  = +document.getElementById('barbers').value;
      const base     = +document.getElementById('base').value;
      const bonus    = +document.getElementById('bonus').value;
      const overhead = +document.getElementById('overhead').value;

      document.getElementById('price-out').textContent    = 'Rp\u00a0' + Math.round(price / 1000) + 'k';
      document.getElementById('cuts-out').textContent     = cuts;
      document.getElementById('days-out').textContent     = days;
      document.getElementById('barbers-out').textContent  = barbers;
      document.getElementById('base-out').textContent     = fmt(base);
      document.getElementById('bonus-out').textContent    = 'Rp\u00a0' + Math.round(bonus / 1000) + 'k';
      document.getElementById('overhead-out').textContent = fmt(overhead);

      const cutsPerBarber     = cuts * days;
      const revenuePerBarber  = cutsPerBarber * price;
      const bonusPerBarber    = cutsPerBarber * bonus;
      const totalPayPerBarber = base + bonusPerBarber;
      const totalRev          = revenuePerBarber * barbers;
      const totalBase         = base * barbers;
      const totalBonus        = bonusPerBarber * barbers;
      const net               = totalRev - totalBase - totalBonus - overhead;
      const margin            = totalRev > 0 ? Math.round((net / totalRev) * 100) : 0;
      const payPct            = revenuePerBarber > 0 ? Math.round((totalPayPerBarber / revenuePerBarber) * 100) : 0;

      // Mini strip
      document.getElementById('m-net').textContent    = fmt(net);
      document.getElementById('m-rev').textContent    = fmt(totalRev);
      document.getElementById('m-margin').textContent = margin + '%';

      // P&L breakdown
      document.getElementById('b-rev').textContent   = fmt(totalRev);
      document.getElementById('b-base').textContent  = '\u2212\u00a0' + fmt(totalBase);
      document.getElementById('b-bonus').textContent = '\u2212\u00a0' + fmt(totalBonus);
      document.getElementById('b-oh').textContent    = '\u2212\u00a0' + fmt(overhead);
      document.getElementById('b-net').textContent   = fmt(net);

      // Sticky bar
      document.getElementById('s-rev').textContent    = fmt(totalRev);
      document.getElementById('s-net').textContent    = fmt(net);
      document.getElementById('s-annual').textContent = fmt(net * 12);

      // Per-barber single card
      document.getElementById('pb-total').textContent     = fmt(totalPayPerBarber);
      document.getElementById('pb-base').textContent      = fmt(base);
      document.getElementById('pb-cuts').textContent      = cutsPerBarber + ' cuts';
      document.getElementById('pb-bonus').textContent     = fmt(bonusPerBarber) + ' (Rp\u00a0' + Math.round(bonus / 1000) + 'k \xd7 ' + cutsPerBarber + ')';
      document.getElementById('pb-rev').textContent       = fmt(revenuePerBarber);
      document.getElementById('pb-pct').textContent       = payPct + '% dari revenue-nya';
      document.getElementById('pb-total-all').textContent = fmt(totalPayPerBarber * barbers);
    }

    update();