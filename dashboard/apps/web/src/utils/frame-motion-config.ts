export const variantesCartao = {
  oculto: { opacity: 0, y: 20 },
  visivel: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  sair: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.2 
    }
  }
}

export const variantesModal = {
  oculto: { opacity: 0, scale: 0.95 },
  visivel: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  }
}
