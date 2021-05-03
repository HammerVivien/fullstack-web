export enum CardType {
    Monster = "Monster", Spell = "Spell", Trap = "Trap"
}

export enum CardSubType {
    NormalMonster = "Normal Monster", EffectMonster = "Effect Monster",

    NormalSpell = "Normal Spell", ContinuousSpell = "Continuous Spell", EquipSpell = "Equip Spell", 
    QuickSpell = "Quick Spell", FieldSpell = "Field Spell", RitualSpell = "Ritual Spell",

    NormalTrap = "Normal Trap", ContinuousTrap = "Continuous Trap", CounterTrap = "Counter Trap"
}

export enum Attribute {
    Light = "Light", Dark = "Dark", Water = "Water", 
    Fire = "Fire", Earth = "Earth", Wind = "Wind"
}