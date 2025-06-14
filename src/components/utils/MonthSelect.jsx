import * as React from 'react'; // Importa React completamente
import { Select } from '@base-ui-components/react/select'; // NOME CORRETTO PER IL COMPONENTE SELECT
import { useEffect, useState } from 'react';
import { format, getYear } from 'date-fns';
import { it } from 'date-fns/locale';
import { useData } from '../../dataContext';
import styles from '../forms/CustomSelect.module.css';
import { CheckIcon, ChevronUpDownIcon } from './Arrows.tsx';

export default function MonthSelect({ setFilteredDatas, cucito }) {
  const { datas } = useData();

  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth()));
  const thisYear = getYear(new Date());

  useEffect(() => {
    filterDataByMonth(Number(selectedMonth));
  }, [datas, selectedMonth, thisYear]);

  function filterDataByMonth(month) {
    const startOfMonth = new Date(thisYear, month, 1).getTime();
    const endOfMonth = new Date(thisYear, month + 1, 1).getTime();

    const newDatas = datas.filter((dato) => {
      const dataDate = new Date(dato.data).getTime();
      return dataDate >= startOfMonth && dataDate < endOfMonth;
    });

    const datasWithoutProp = newDatas.filter(dato => {
      if(cucito === false){
        return (dato.cucito_in === null || dato.cucito_in === undefined) && (dato.cucito_out === null || dato.cucito_out === undefined);
      } else {
        return (dato.cucito_in !== null || dato.cucito_in !== undefined) && (dato.cucito_out !== null || dato.cucito_out !== undefined);
      }

    });

    setFilteredDatas(datasWithoutProp);
  }

  function handleChangeMonth(event, newValue) {
    if (newValue !== null && newValue !== undefined) {
      setSelectedMonth(String(newValue));
    } else {
      setSelectedMonth(String(event));
    }
  }

  return (
    <div className={styles.SelectContainer}>
      <Select.Root onValueChange={handleChangeMonth} value={selectedMonth}>
        <Select.Trigger className={styles.SelectTrigger}>
          <Select.Value className={styles.SelectValue} />
          <Select.Icon className={styles.SelectIcon}>
            <ChevronUpDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={styles.Positioner}>
            <Select.Popup className={styles.Popup}>
              {Array.from({ length: 12 }, (_, i) => (
                <Select.Item key={i} value={String(i)} className={styles.Item}>
                  <Select.ItemText className={styles.ItemText}>
                    {format(new Date(thisYear, i, 1), "MMMM", { locale: it })}
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