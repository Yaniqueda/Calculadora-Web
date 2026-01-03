// Calculator logic (refined & safe for beginner portfolio)
(() => {
  const displayEl = document.getElementById('display');
  const keys = document.querySelectorAll('.btn');

  let expression = '';

  const operators = ['+', '−', '×', '÷'];

  function updateDisplay() {
    displayEl.textContent = expression || '0';
  }

  function lastChar() {
    return expression.slice(-1);
  }

  function canAddDot() {
    const parts = expression.split(/[+\−×÷]/);
    return !parts[parts.length - 1].includes('.');
  }

  function appendValue(val) {
    // Não começar com operador
    if (!expression && operators.includes(val)) return;

    // Evitar operadores duplicados
    if (
      operators.includes(lastChar()) &&
      operators.includes(val)
    ) return;

    // Evitar múltiplos pontos no mesmo número
    if (val === '.' && !canAddDot()) return;

    // Evitar zeros à esquerda
    if (expression === '0' && val !== '.') {
      expression = val;
    } else {
      expression += val;
    }

    updateDisplay();
  }

  function clearAll() {
    expression = '';
    updateDisplay();
  }

  function backspace() {
    if (!expression) return;
    expression = expression.slice(0, -1);
    updateDisplay();
  }

  function evaluateExpression() {
    if (!expression) return;

    const normalized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Validação de segurança
    if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
      showError();
      return;
    }

    try {
      const result = Function(
        '"use strict"; return (' + normalized + ')'
      )();

      if (!isFinite(result)) throw new Error();

      // Limita casas decimais
      expression = String(Number(result.toFixed(8)));
      updateDisplay();
    } catch {
      showError();
    }
  }

  function showError() {
    displayEl.textContent = 'Error';
    expression = '';
  }

  // Clique nos botões
  keys.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      const action = btn.dataset.action;

      if (action === 'clear') return clearAll();
      if (action === 'backspace') return backspace();
      if (action === 'equals') return evaluateExpression();
      if (val) appendValue(val);
    });
  });

  // Suporte ao teclado
  window.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9') return appendValue(e.key);
    if (e.key === '.') return appendValue('.');
    if (e.key === 'Backspace') return backspace();
    if (e.key === 'Escape') return clearAll();
    if (e.key === 'Enter' || e.key === '=') return evaluateExpression();

    const map = {
      '/': '÷',
      '*': '×',
      '-': '−',
      '+': '+',
      '(': '(',
      ')': ')'
    };

    if (map[e.key]) appendValue(map[e.key]);
  });

  updateDisplay();
})();
