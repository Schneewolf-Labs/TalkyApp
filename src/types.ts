export type Message = {
    author: string;
    text: string;
};

export type Setting = {
    name: string;
    value: any;
    setValue: (value: any) => void;
};
  