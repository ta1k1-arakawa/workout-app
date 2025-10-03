export interface MenuItem {
  name: string
  sets: string
  reps: string
  weight?: string
  rest?: string
}

export interface DayMenu {
  type: string
  menu: MenuItem[]
  tips?: string
  totalTime?: string
}

export interface MenuData {
  weeklyMenu: Record<string, DayMenu>
  weeklyTips?: string
}

export interface WorkoutMenu {
    id: string
    name: string
    createdAt: Date
    menuData: MenuData
}

export interface WorkoutMenuInput {
    name: string
    menuData: MenuData
}

