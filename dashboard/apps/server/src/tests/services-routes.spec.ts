import "dotenv/config.js";
import request from "supertest";
import { server } from "..";

describe("Testes para a rota de Serviços", () => {
  it('Deve retornar erro pois não está passando o userId na rota', async () => {
    const response = await request(server).get('/api/services');
    expect(response.body).toStrictEqual({ 
      "error": "ID do usuário é obrigatório (forneça userId na query)"
    });
  });

  it('Deve retornar todos os serviços', async () => {
    const userIdAdmin = process.env.USERID_FOR_TEST;

    const response = await request(server)
    .get(`/api/services/?userId=${userIdAdmin}`);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.any(String),
          description: expect.any(String),
          price: expect.any(String),
          scheduledAt: expect.any(String),
          status: expect.any(String),
          createdBy: expect.any(String),
          createdAt: expect.any(String),
        })
      ])
    );
  });

  it("Deve retornar um serviço", async () => {
    const serviceID = process.env.SERVICE_ID;

    const response = await request(server)
      .get(`/api/services/${serviceID}`); 

    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        service: expect.objectContaining({
          type: expect.any(String),
          description: expect.any(String),
          price: expect.any(String),
          scheduledAt: expect.any(String),
          status: expect.any(String),
          createdBy: expect.any(String),
          createdAt: expect.any(String),
        })
      })
    );
  });

});
