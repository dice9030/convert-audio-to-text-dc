 const btnIniciar = document.getElementById('btnIniciar');
    const btnDetener = document.getElementById('btnDetener');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const btnCopiar = document.getElementById('btnCopiar');
    const btnExportar = document.getElementById('btnExportar');
    const texto = document.getElementById('texto');
    const icono = document.getElementById('iconoMicrofono');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let textoFinal = '';
    let escuchando = false;

    if (!SpeechRecognition) {
      alert('Tu navegador no soporta la Web Speech API. Usa Google Chrome.');
    } else {
      recognition = new SpeechRecognition();
      recognition.lang = 'es-PE';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        console.log('Reconocimiento iniciado');
      };

      recognition.onresult = (event) => {
        let textoTemporal = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const resultado = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            textoFinal += resultado + '\n';
          } else {
            textoTemporal += resultado;
          }
        }
        texto.textContent = textoFinal + textoTemporal;
      };

      recognition.onerror = (event) => {
        console.warn('Error:', event.error);
        if (event.error === 'no-speech') {
          console.log('Silencio detectado, reiniciando...');
          recognition.stop(); // se reiniciará en onend
        }
      };

      recognition.onend = () => {
        if (escuchando) {
          console.log('Reconocimiento reiniciado');
          recognition.start();
        }
      };

      btnIniciar.onclick = () => {
        navigator.permissions.query({ name: 'microphone' }).then((permiso) => {
          if (permiso.state === 'denied') {
            alert('Debes permitir el uso del micrófono para que funcione.');
            return;
          }

          escuchando = true;
          textoFinal = '';
          recognition.start();
          btnIniciar.disabled = true;
          btnDetener.disabled = false;
          icono.classList.add('activo');
        });
      };

      btnDetener.onclick = () => {
        escuchando = false;
        recognition.stop();
        btnIniciar.disabled = false;
        btnDetener.disabled = true;
        icono.classList.remove('activo');
      };

      btnLimpiar.onclick = () => {
        textoFinal = '';
        texto.textContent = 'Texto reconocido aparecerá aquí...';
      };

      btnCopiar.onclick = () => {
        navigator.clipboard.writeText(texto.textContent).then(() => {
          alert('Texto copiado al portapapeles.');
        }).catch(() => {
          alert('Error al copiar el texto.');
        });
      };

      btnExportar.onclick = () => {
        const blob = new Blob([texto.textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'transcripcion.txt';
        enlace.click();
        URL.revokeObjectURL(url);
      };
    }