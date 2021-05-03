import { app } from "../src/app";
import supertest from "supertest";
import { CardSubType, CardType } from "../src/entities/CardType";

describe("Deck Builder", () => {
    const admin = { username: "kaiba", password: "admin" };
    const user = { username: "user", password: "123" };

    let requestHandle: supertest.SuperTest<supertest.Test>;

    beforeEach(() => {
        requestHandle = supertest(app);
    });

    describe("Authentication", () => {
        it("should register", async () => {
            await requestHandle.post("/user/register").send(user).expect(200);
        });

        it("should fail on same user registration", async () => {
            await requestHandle.post("/user/register").send(user).expect(409);
        });

        it("should login with registered user", async () => {
            await requestHandle.post("/user/login").send(user).expect(200);
        });
    });

    describe("Card controller", () => {
        let userToken: string;
        let adminToken: string;

        let time: Date;
        let createdCard: object;
        let createdDeck: object;
        let createdDeckShort: object;
        beforeAll(() => {
            time = new Date();
            jest.useFakeTimers("modern");
            jest.setSystemTime(time);
            createdCard = {
                id: 1,
                name: "Blue-Eyes White Dragon",
                description:
                    "This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.",
                type: CardType.Monster,
                subType: CardSubType.NormalMonster,
                race: "Dragon",
                level: 8,
                attack: 3000,
                defense: 2500,
                attribute: "Light",
                //createdAt: time.toISOString(),
                //modifiedAt: time.toISOString(),
            };
            createdDeck = {
                id: 1,
                name: 'Blue-Eyes Deck',
                description: 'The best deck',
                isPublic: true,
                cards: [ 1, 1, 1 ],
                favorites: [],
                createdAt: time.toISOString(),
                modifiedAt: time.toISOString(),
                user: 3,
            };
            createdDeckShort = {
                id: 1,
                name: 'Blue-Eyes Deck',
                description: 'The best deck',
                isPublic: true,
                createdAt: time.toISOString(),
                modifiedAt: time.toISOString(),
                user: 3,
            };
        });
        afterAll(() => {
            jest.useRealTimers();
        });

        beforeEach(async () => {
            const loginResponse = await requestHandle
                .post("/user/login")
                .send(user);
            const adminResponse = await requestHandle
                .post("/user/login")
                .send(admin);
            userToken = `Bearer ${loginResponse.body.token}`;
            adminToken = `Bearer ${adminResponse.body.token}`;
        });

        describe("/card", () => {
            it("should list even when user is not provided", async () => {
                await requestHandle.get("/card").expect(200);
            });

            it("should return empty array", async () => {
                await requestHandle
                    .get("/card")
                    .set("Authorization", userToken)
                    .expect(200)
                    .expect([]);
            });

            it("should create a card", async () => {
                await requestHandle
                    .post("/card")
                    .set("Authorization", adminToken)
                    .send({
                        name: "Blue-Eyes White Dragon",
                        description:
                            "This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.",
                        type: CardType.Monster,
                        subType: CardSubType.NormalMonster,
                        race: "Dragon",
                        level: 8,
                        attack: 3000,
                        defense: 2500,
                        attribute: "Light",
                    })
                    .expect(200)
                    .expect({
                        ...createdCard,
                    });
            });

            it("should return the newly created card in an array for the user", async () => {
                await requestHandle
                    .get("/card")
                    .set("Authorization", userToken)
                    .expect(200)
                    .expect([createdCard]);
            });

            describe("/card/:id", () => {
                it("should return the card even when user is not provided", async () => {
                    await requestHandle.get("/card/1").expect(200);
                });

                it("should return the requested card", async () => {
                    await requestHandle
                        .get("/card/1")
                        .set("Authorization", userToken)
                        .expect(200)
                        .expect((res) => {
                            expect(res.body).toEqual({
                                ...createdCard
                            });
                        });
                });

                it("should return 404 when the card does not exist", async () => {
                    await requestHandle
                        .get("/card/10")
                        .set("Authorization", userToken)
                        .expect(404);
                });
            });

            describe("/card/search", () => {
                it("should find the card we searched for", async () => {
                    await requestHandle
                        .get('/card/search?name=Blue-Eyes White Dragon')
                        .set("Authorization", userToken)
                        .expect(200)
                        .expect([createdCard]);
                });

                it("should return an empty array if no card exist", async () => {
                    await requestHandle
                        .get('/card/search?name="Dark Magician"')
                        .set("Authorization", userToken)
                        .expect(200)
                        .expect([]);
                });
            });

            describe("/deck", () => {
                it("should return the newly created deck", async () => {
                    await requestHandle
                        .post("/deck")
                        .set("Authorization", userToken)
                        .send({
                            name: "Blue-Eyes Deck",
                            description: "The best deck",
                            cards: [1, 1, 1],
                            isPublic: true,
                        })
                        .expect(200)
                        .expect(createdDeck);
                });

                it("should return every public deck", async () => {
                    await requestHandle
                        .get("/deck")
                        .set("Authorization", userToken)
                        .expect(200)
                        .expect([createdDeckShort]);
                });

                it("should change the cards in the deck", async () => {
                    await requestHandle
                        .put("/deck/1")
                        .set("Authorization", userToken)
                        .send({
                            cards: [1],
                        })
                        .expect(200);
                    await requestHandle
                        .get("/deck/1")
                        .set("Authorization", userToken)
                        .expect((res) => {
                            expect(res.body.cards).toEqual([1]);
                        });
                });

                it("should add the deck to the favorites", async() => {
                    
                    await requestHandle
                        .post("/deck/favorite/1")
                        .set("Authorization", userToken)
                        .expect(200);
                    await requestHandle
                        .get("/deck/1")
                        .set("Authorization", userToken)
                        .expect((res) => {
                            expect(res.body.favorites).toEqual([3]);
                        });
                });

                it("should remove the deck from the favorites", async() => {
                    
                    await requestHandle
                        .post("/deck/unfavorite/1")
                        .set("Authorization", userToken)
                        .expect(200);
                    await requestHandle
                        .get("/deck/1")
                        .set("Authorization", userToken)
                        .expect((res) => {
                            expect(res.body.favorites).toEqual([]);
                        });
                });
            });
        });
    });
});
