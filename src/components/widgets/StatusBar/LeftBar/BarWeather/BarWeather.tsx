import { IconSetWeather } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { Collapsible } from '@/components/common/Collapsible';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './BarWeather.css';
import { useWeatherIcon } from './hooks/useWeatherIcon';

export const BarWeather = ({ isIdle }: { isIdle: boolean }) => {
  const weather = useRepo(repo.weather.weather);
  const activeWeather = weather?.weather.at(0);
  const weatherIcon = useWeatherIcon(activeWeather?.icon, activeWeather?.id);

  return (
    <Collapsible
      css={styles.weatherCollapsibleStyle(!!activeWeather)}
      orientation="horizontal"
      isVisible={!!activeWeather}
    >
      <div css={styles.weatherStyle}>
        <IconSetWeather kind={weatherIcon} css={styles.weatherIconStyle} />
        <div css={styles.weatherColumnStyle}>
          <h1 css={styles.weatherHeaderStyle}>
            {weather && `${Math.round(weather?.main.feels_like - 273.15).toString()} °C`}
          </h1>
          <Collapsible orientation="vertical" isVisible={isIdle}>
            <div css={styles.weatherConditionStyle(isIdle)}>
              <span>{activeWeather?.main}</span>
              <span css={styles.weatherConditionDividerStyle} />
              <span>{weather && Math.round(weather?.main.humidity).toString()}%</span>
            </div>
          </Collapsible>
        </div>
      </div>
    </Collapsible>
  );
};
