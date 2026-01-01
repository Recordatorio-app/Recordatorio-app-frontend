export interface LoginResponseDTO {
  token: string;
  user: [
    {
      id: string;
      name: string;
      email: string;
    }
  ];
}

export interface RegisterResponseDTO {
  token: string;
  user: [
    {
      id: string;
      name: string;
      email: string;
    }
  ];
}
export interface ColorPalette {
  urgente?: string;
  importante?: string;
  normal?: string;
  baja?: string;
  personal?: string;
  otro?: string;
};
