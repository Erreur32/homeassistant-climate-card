// ClimateDeviceManager.ts

import { HomeAssistant, HassEntity } from 'custom-card-helpers';

export enum HVAC_ACTION {
  OFF = 'off',
  HEATING = 'heating',
  COOLING = 'cooling',
  DRYING = 'drying',
  IDLE = 'idle',
  FAN = 'fan',
}

export enum HVAC_MODE {
  OFF = 'off',
  HEAT = 'heat',
  COOL = 'cool',
  HEAT_COOL = 'heat_cool',
  AUTO = 'auto',
  DRY = 'dry',
  FAN_ONLY = 'fan_only',
}

export class ClimateDeviceManager {
  private _hass: HomeAssistant;
  private _entityId: string;
  public stateObj: HassEntity;

  constructor(hass: HomeAssistant, entityId: string) {
    this._hass = hass;
    this._entityId = entityId;
    this.stateObj = hass.states[entityId];
  }

  public updateState(hass: HomeAssistant) {
    this._hass = hass;
    this.stateObj = hass.states[this._entityId];
  }

  public get hvacAction(): HVAC_ACTION {
    const action = this.stateObj.attributes.hvac_action as HVAC_ACTION;
    if (!Object.values(HVAC_ACTION).includes(action)) {
      return HVAC_ACTION.IDLE; // Valeur par défaut si l'action est inconnue
    }
    return action;
  }

  public get hvacMode(): HVAC_MODE {
    const mode = this.stateObj.state as HVAC_MODE;
    if (!Object.values(HVAC_MODE).includes(mode)) {
      return HVAC_MODE.OFF; // Valeur par défaut si le mode est inconnu
    }
    return mode;
  }

  public get temperature(): number {
    return this.stateObj.attributes.temperature;
  }

  public get currentTemperature(): number {
    return this.stateObj.attributes.current_temperature;
  }

  public get minTemperature(): number {
    return this.stateObj.attributes.min_temp;
  }

  public get maxTemperature(): number {
    return this.stateObj.attributes.max_temp;
  }

  public get targetTemperatureStep(): number {
    return this.stateObj.attributes.target_temp_step || 0.5;
  }

  public setHvacMode(mode: HVAC_MODE) {
    this._hass.callService('climate', 'set_hvac_mode', {
      entity_id: this._entityId,
      hvac_mode: mode,
    });
  }

  public setTemperature(temperature: number) {
    this._hass.callService('climate', 'set_temperature', {
      entity_id: this._entityId,
      temperature: temperature,
    });
  }

  public turnOn() {
    this._hass.callService('climate', 'turn_on', {
      entity_id: this._entityId,
    });
  }

  public turnOff() {
    this._hass.callService('climate', 'turn_off', {
      entity_id: this._entityId,
    });
  }

  // Ajoutez ici d'autres méthodes ou propriétés si nécessaire...
}
