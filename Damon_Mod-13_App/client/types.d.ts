declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare global {
  var authToken: string | undefined;
  var userId: number | undefined;
  var customerId: number | undefined;
}

export {};
