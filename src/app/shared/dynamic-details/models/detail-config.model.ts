export interface DetailField {
  key: string;        // Назва поля в об'єкті (напр., 'contractName')
  label: string;      // Назва для користувача (напр., 'Назва контракту')
  type?: 'text' | 'date' | 'status' | 'badge'; // Формат відображення
}

export interface DetailAction {
  actionId: string;   // Унікальний ідентифікатор дії (напр., 'approve', 'delete', 'print')
  label: string;      // Текст кнопки
  color?: 'primary' | 'accent' | 'warn'; // Колір Angular Material
  icon?: string;      // Опціональна іконка
}

export interface DetailsConfig {
  title: string;
  fields: DetailField[];
  actions?: DetailAction[];
}