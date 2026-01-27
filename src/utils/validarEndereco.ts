export function validarEndereco(endereco: string): boolean {
  if (!endereco) return false;

  if (endereco.length < 10) return false;

  const temNumero = /\d/.test(endereco);
  const temLetra = /[a-zA-Z]/.test(endereco);

  if (!temNumero || !temLetra) return false;

  return true;
}