const unusedVar = "hello"; // Deveria ser detectado pelo ESLint
function example(param: string) { // Sem tipo de retorno, ESLint deve avisar
  console.log(param);
}
