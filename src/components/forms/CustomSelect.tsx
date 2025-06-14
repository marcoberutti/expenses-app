import { Select } from '@base-ui-components/react/select';
import { useState, useEffect } from 'react';
import { useData } from '../../dataContext';
import { useConfig } from '../../configContext';
import styles from './CustomSelect.module.css';
import { CheckIcon, ChevronUpDownIcon } from '../utils/Arrows.tsx';

export default function CustomSelect({ datasForUpdate, setFormData }) {
  const getCurrentTipologia = () => {
    if (!datasForUpdate) return "";
    if (datasForUpdate.Spesa) return "Spesa";
    if (datasForUpdate.Income) return "Income";
    if (datasForUpdate.Benzina) return "Benzina";
    if (datasForUpdate.Extra) return "Extra";
    if (datasForUpdate.Casa) return "Casa";
    if (datasForUpdate.Salute) return "Salute";
    if (datasForUpdate.Investimenti) return "Investimenti";
    if (datasForUpdate.tasse) return "tasse";
    if (datasForUpdate.cucito_in) return "cucito_in";
    if (datasForUpdate.cucito_out) return "cucito_out";
    return "";
  };

  const [selectedValue, setSelectedValue] = useState("");
  const { select } = useData(); // 'select' determina se mostrare income o outcome
  const { valoriOutcome, valoriIncome } = useConfig();

  useEffect(() => {
    const initialValue = getCurrentTipologia();
    setSelectedValue(initialValue);
  }, [datasForUpdate]); // Dipendenza da datasForUpdate

  const handleSelectChange = (event, newValue) => {
    const value = newValue ?? "";

    if (!value) return;

    setSelectedValue(value);

    setFormData((prev) => {
        const updatedFormData = { ...prev };
        const possibleTipologiaKeys = [
          "Spesa", "Income", "Benzina", "Extra", "Casa",
          "Salute", "Investimenti", "tasse", "cucito_in", "cucito_out"
        ];
        possibleTipologiaKeys.forEach(key => {
            if (updatedFormData.hasOwnProperty(key)) { // Solo se la chiave esiste in formData
                updatedFormData[key] = null;
            }
        });

        updatedFormData[value] = datasForUpdate?.[value] || true; // Usa true o il valore effettivo se esiste

        return updatedFormData;
    });
  };

  const dropdownValues = select === "outcome" ? valoriOutcome : valoriIncome;

  return (
    <div className={styles.SelectContainer}>
      <Select.Root
        name="tipologia"
        value={selectedValue}
        onValueChange={handleSelectChange}
      >
        <Select.Trigger className={styles.SelectTrigger}>
          <Select.Value className={styles.SelectValue} />
          <Select.Icon className={styles.SelectIcon}>
            <ChevronUpDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={styles.Positioner}>
            <Select.Popup className={styles.Popup}>
              {dropdownValues.map((valore) => (
                <Select.Item key={valore} value={valore} className={styles.Item}>
                  <Select.ItemText className={styles.ItemText}>
                    {valore}
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.ItemIndicator}>
                    <CheckIcon className={styles.ItemIndicatorIcon} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
