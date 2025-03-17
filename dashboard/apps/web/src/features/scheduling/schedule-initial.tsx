import { getRuleOfUser, gettAllServices } from "@/services/agenda-services";
import { auth } from "@clerk/nextjs/server";
import ScheduleAdminPanel from "./container/schedule-admin-panel";
import ScheduleClientPanel from "./container/schedule-client-panel";

export const InitialSchedule = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div>
        <p>Erro: Nenhum usuário autenticado encontrado.</p>
      </div>
    );
  }

  const rules = await getRuleOfUser(userId);
  const services = await gettAllServices({
    userId: userId,
    initialValue: 0,
    limitValue: 5,
  });

  console.log("Rules retornadas:", rules);
  console.log("Services retornados:", services);

  if (!rules || (Array.isArray(rules) && rules.length === 0)) {
    return (
      <div>
        <p>Nenhuma regra encontrada para o usuário.</p>
      </div>
    );
  }

  if (Array.isArray(rules)) {
    const isAdmin = rules.some((ruleItem) => ruleItem.rule === "Admin");
    if (isAdmin) {
      return <ScheduleAdminPanel />;
    }
    const isClient = rules.some((ruleItem) => ruleItem.rule === "Client");
    if (isClient) {
      return <ScheduleClientPanel />;
    }
  } 
  else if (typeof rules === "object" && rules !== null) {
    if (rules.rule === "Admin") {
      return <ScheduleAdminPanel />;
    }
    if (rules.rule === "Client") {
      return <ScheduleClientPanel />;
    }
  }

  return (
    <div>
      <p>Erro: Regra do usuário não reconhecida.</p>
    </div>
  );
};