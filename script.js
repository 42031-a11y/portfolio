/**
 * PORTFÓLIO DAVI NASCIMENTO
 * Animação fluida da bola de vôlei com revelação sincronizada do nome
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos principais
  const actor = document.getElementById('volleyballActor');
  const ball = document.getElementById('volleyballBall');
  const revealedName = document.getElementById('revealedName');
  const replayBtn = document.getElementById('replayBtn');
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let animFrameId = null;
  let isAnimating = false;

  /**
   * Animação da bola de vôlei atravessando a tela da esquerda para a direita
   * e revelando progressivamente o nome "Davi Nascimento"
   */
  function launchVolleyball() {
    if (isAnimating && animFrameId) {
      cancelAnimationFrame(animFrameId);
    }
    isAnimating = true;

    // Reset de estilos iniciais
    actor.style.transition = 'none';
    actor.classList.remove('floating');
    
    // Obter posições na tela
    const windowWidth = window.innerWidth;
    const track = document.getElementById('flightTrack');
    const trackRect = track ? track.getBoundingClientRect() : { top: 0, left: 0 };
    const titleRect = revealedName.getBoundingClientRect();
    
    // Início fora da tela à esquerda
    const isMobile = windowWidth <= 768;
    const startX = isMobile ? -100 : -140;
    
    // Fim da trajetória: ultrapassa toda a tela à direita no mobile,
    // ou repousa elegantemente à direita do título no desktop
    const endX = isMobile 
      ? windowWidth + 60 
      : Math.min(windowWidth - 140, Math.max(windowWidth * 0.78, titleRect.right + 60));

    // Alinhamento vertical preciso: a bola passa na altura do nome
    const ballHeight = isMobile ? 72 : 110;
    const baselineY = titleRect.top - trackRect.top + (titleRect.height * 0.1) - (ballHeight * 0.35);

    // Duração total em milissegundos
    const duration = isMobile ? 1900 : 2200;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing suave (lance com aceleração e desaceleração fluida)
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Posição horizontal
      const currentX = startX + (endX - startX) * ease;

      // Parábola de altura (arco de trajetória esportiva)
      const arcHeight = isMobile ? 24 : 36;
      const arcOffset = -Math.sin(progress * Math.PI) * arcHeight;
      const currentY = baselineY + arcOffset;

      // Rotação da bola em graus (giro no ar)
      const rotation = progress * (isMobile ? 540 : 720);

      // Aplicar transformações
      actor.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
      ball.style.transform = `rotate(${rotation.toFixed(1)}deg)`;

      // Sincronizar revelação do texto "Davi Nascimento"
      const ballRadius = isMobile ? 36 : 55;
      const ballFrontX = currentX + (ballRadius * 1.3);
      
      const titleLeft = titleRect.left;
      const titleWidth = titleRect.width;

      if (titleWidth > 0) {
        if (ballFrontX <= titleLeft) {
          revealedName.style.clipPath = 'inset(0 100% 0 0)';
        } else if (ballFrontX >= titleLeft + titleWidth) {
          revealedName.style.clipPath = 'inset(0 0% 0 0)';
        } else {
          const revealedRatio = (ballFrontX - titleLeft) / titleWidth;
          const maskPercent = Math.max(0, Math.min(100, (1 - revealedRatio) * 100));
          revealedName.style.clipPath = `inset(0 ${maskPercent.toFixed(2)}% 0 0)`;
        }
      }

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        // Finalização: garantir visibilidade completa de 100%
        revealedName.style.clipPath = 'inset(0 0% 0 0)';
        revealedName.style.transition = 'none';
        isAnimating = false;

        // Se a bola parou no campo visual (desktop), adicionar flutuação suave
        if (!isMobile && currentX < windowWidth) {
          actor.style.transition = 'transform 0.4s ease-out';
          actor.classList.add('floating');
        }
      }
    }

    animFrameId = requestAnimationFrame(step);
  }

  // Iniciar após pequeno delay para carregamento e renderização fluida
  setTimeout(() => {
    launchVolleyball();
  }, 250);

  // Botão de Repetir
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      launchVolleyball();
    });
  }

  // Atualizar posições em caso de resize da tela
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!isAnimating) {
        revealedName.style.clipPath = 'inset(0 0% 0 0)';
      }
    }, 150);
  });

  // ==========================================================================
  // NAVEGAÇÃO & HEADER
  // ==========================================================================

  // Efeito de rolagem no cabeçalho
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Menu Mobile Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fechar menu mobile ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy para link ativo no menu
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
});
