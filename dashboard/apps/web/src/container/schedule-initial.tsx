"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CheckCircle, ChevronDown, Clock, Plus, X } from "lucide-react"
import { variantesCartao } from "@/utils/frame-motion-config"

export default function AgendaInicial() {
  const [abaSelecionada, setAbaSelecionada] = useState<"agenda" | "calendario">("calendario")
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)


  return (
    <div className="w-full min-h-screen mx-auto p-4 font-sans">
      {/* Menu mobile */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Agenda</h1>
        <Button
          variant="ghost"
          onClick={() => setMenuMobileAberto(!menuMobileAberto)}
        >
          {menuMobileAberto ? <X className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </Button>
      </div>

      <AnimatePresence>
        {menuMobileAberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mb-4 space-y-2"
          >
            <Button
              variant={abaSelecionada === "calendario" ? "default" : "ghost"}
              className="w-full"
              onClick={() => {
                setAbaSelecionada("calendario")
                setMenuMobileAberto(false)
              }}
            >
              Agenda para hoje
            </Button>
            <Button
              variant={abaSelecionada === "agenda" ? "default" : "ghost"}
              className="w-full"
              onClick={() => {
                setAbaSelecionada("agenda")
                setMenuMobileAberto(false)
              }}
            >
              Agendamentos pendentes
            </Button>
            <Button
              className="w-full bg-violet-500 hover:bg-violet-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Definir lembrete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <motion.div 
          className="md:col-span-5 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className=" md:flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold">Vamos ver os agendamentos</h1>
              <p className="text-sm text-muted-foreground">Visualização rápida dos agendamentos...</p>
            </div>
            <Button 
              className="bg-violet-500 hover:bg-violet-600 text-white rounded-full"
            >
              Verificar todos
            </Button>
          </div>

          <div>
            <h2 className="text-base font-medium mb-3">Agendamentos aceitos</h2>
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                <motion.div variants={variantesCartao} initial="oculto" animate="visivel" exit="sair">
                  <Card className="bg-violet-500 text-white rounded-xl border-none overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Criar Kit de Dashboard</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>25 de agosto de 2021</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Clock className="h-3 w-3 mr-2" />
                          <span>09:00 - 10:00</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 text-white">
                        Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={variantesCartao} initial="oculto" animate="visivel" exit="sair">
                  <Card className="bg-pink-500 text-white rounded-xl border-none overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Página inicial com responsividade</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>24 de agosto de 2021</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Clock className="h-3 w-3 mr-2" />
                          <span>09:00 - 10:00</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 text-white">
                        Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div variants={variantesCartao} initial="oculto" animate="visivel">
            <h2 className="text-base font-medium mb-3">Agendamento para essa semana (2)</h2>
            <Card className="border rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <h3 className="text-sm font-medium">Reunião com Sr. Bean</h3>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div 
          className=" md:block md:col-span-7"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button
                  variant={abaSelecionada === "calendario" ? "default" : "ghost"}
                  onClick={() => setAbaSelecionada("calendario")}
                >
                  Agenda para hoje
                </Button>
                <Button
                  variant={abaSelecionada === "agenda" ? "default" : "ghost"}
                  onClick={() => setAbaSelecionada("agenda")}
                >
                  Agendamentos pendentes
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {abaSelecionada === "calendario" && (
                <motion.div
                  key="calendario"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <motion.div variants={variantesCartao} initial="oculto" animate="visivel">
                    <h3 className="text-sm font-medium mb-2">Quinta-feira, 23 de novembro</h3>
                    <Card className="bg-slate-800 text-white rounded-xl border-none hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="text-sm font-medium mr-4 pt-1">10:00</div>
                            <div className="flex-1">
                              <h4 className="text-base font-semibold">Aplicativo móvel com protótipo</h4>
                              <p className="text-xs text-gray-300 mt-1">Criar dois designs de aplicativos móveis e protótipo</p>
                            </div>
                          </div>
                          <ChevronDown className="h-5 w-5" />

                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={variantesCartao} initial="oculto" animate="visivel">
                    <h3 className="text-sm font-medium mb-2">Sexta-feira, 09 de maio</h3>
                    <Card className="bg-blue-600 text-white rounded-xl border-none hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="text-sm font-medium mr-4 pt-1">10:00</div>
                            <div className="flex-1">
                              <h4 className="text-base font-semibold">Criação de moodboard de design UI</h4>
                              <p className="text-xs text-blue-200 mt-1">
                                Criar um design de todas as categorias, após fazer um aplicativo de humor
                              </p>
                            </div>
                          </div>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={variantesCartao} initial="oculto" animate="visivel">
                    <h3 className="text-sm font-medium mb-2">Sábado, 04 de fevereiro</h3>
                    <Card className="bg-pink-500 text-white rounded-xl border-none hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="text-sm font-medium mr-4 pt-1">12:00</div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold">Página inicial e responsiva</h4>
                            <p className="text-xs text-pink-200 mt-1">
                              Fazer um site visível em qualquer dispositivo, e torná-lo FHD, a parte importante
                            </p>
                          </div>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {abaSelecionada === "agenda" && (
                <motion.div
                  key="agenda"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-8"
                >
                  <h3 className="text-lg font-medium">Visualização da Agenda</h3>
                  <p className="text-muted-foreground">Visualização da agenda em breve!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

    </div>
  )
}