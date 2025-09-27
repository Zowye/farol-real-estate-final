export default defineEventHandler(async () => {
  const res = await $fetch("http://ml-ml-hello-1:8080/v1/ping");
  return res; // deve retornar { message: "pong" }
});
