export type MezonError = Error | string;

function raiseError(error: MezonError) {
  console.error(error);
}

export {
    raiseError
}