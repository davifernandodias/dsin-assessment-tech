import request from "supertest";
import { app } from "../../index";
import { ServicesMock, UserMockAdmin, UserMockClient } from "../mock/mock-api";

describe("Services tests", () => {
  it("should create a service with the simulated data, if the service type does not exist it creates one", async () => {
    const response = await request(app)
      .post(`/api/services?userId=${UserMockAdmin.id}`)
      .send(ServicesMock);
    expect(Array.isArray(response.body)).toBe(false);
    expect(response.body).toHaveProperty("message", "Serviço criado com sucesso");
    expect(response.body).toHaveProperty("service");
    const service = response.body.service;
    expect(service).toHaveProperty("id");

    console.log("response no test:", response.body);
  });
  it("should return an error message warning that only admin can create a service", async () => {
    try {
      const response = await request(app)
        .post(`/api/services?userId=${UserMockClient.id}`)
        .send(ServicesMock);
      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Apenas Admins podem criar serviços");
    } catch (error) {
      console.log(
        "error ao retornar mensagem de erro ao criar serviço com usuário não admin: ",
        error
      );
    }
  });

  it("shoud return all services", async () => {
    try {
      const response = await request(app).get(
        `/api/services?initial=0&limit=1000`
      );
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    } catch (error) {
      console.log("error ao retornar todos os serviços: ", error);
    }
  });

  it("should return only one service based on the id passed in params", async () => {
    try {
      const response = await request(app).get(
        `/api/services/${ServicesMock.id}`
      );
      expect(response.body).toHaveProperty("service");
      expect(response.body.service).toHaveProperty("id");
      expect(response.body.service.id).toBe(ServicesMock.id);
    } catch (error) {
      console.log(
        "error ao retornar um serviço baseado no id passado: ",
        error
      );
    }
  });
  it("should return all types of services", async () => {
    try {
      const response = await request(app).get(
        `/api/service-types?initial=0&limit=1000`
      );
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    } catch (error) {
      console.log("error ao retornar todos os tipos de serviços: ", error);
    }
  });
  it("should return only one type of service based on the id passed in params", async () => {
    try {
      const response = await request(app).get(
        `/api/service-types/${ServicesMock.typeId}`
      );
      expect(response.body).toHaveProperty("serviceType");
      expect(response.body.serviceType).toHaveProperty("id");
      expect(response.body.serviceType.id).toBe(ServicesMock.typeId);
    } catch (error) {
      console.log(
        "error ao retornar um tipo de serviço baseado no id passado: ",
        error
      );
    }
  });
  it("should remove a service and type based on the id passed in params", async () => {
    try {
      const response = await request(app).delete(
        `/api/services/${ServicesMock.id}`
      );
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Service removed");
    } catch (error) {
      console.log("error ao remover um serviço baseado no id passado: ", error);
    }
  });
  it("should update a service based on the id passed in params", async () => {
    try {
      const response = await request(app)
        .put(`/api/services/${ServicesMock.id}`)
        .send(ServicesMock);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Serviço atualizado com sucesso",
          service: expect.objectContaining({
            ...ServicesMock,
            price: "190.00",
            createdAt: expect.any(String),
          }),
        })
      );
    } catch (error) {
      console.log(
        "Erro ao atualizar um serviço baseado no id passado: ",
        error
      );
    }
  });
});
