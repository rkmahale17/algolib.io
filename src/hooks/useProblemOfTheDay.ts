import { useState, useEffect, useMemo } from 'react';
import { AlgorithmListItem } from '@/types/algorithm';

const SEED = 0x52554C; // 'RUL' in hex, a fixed seed for the project

function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  const random = mulberry32(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const getCountdown = () => {
  const now = new Date();
  const next7AM = new Date(now);
  next7AM.setHours(7, 0, 0, 0);
  if (now.getTime() >= next7AM.getTime()) {
    next7AM.setDate(next7AM.getDate() + 1);
  }
  const diffMs = next7AM.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

export const useProblemOfTheDay = (algorithms: AlgorithmListItem[]) => {
  const [countdown, setCountdown] = useState(getCountdown());
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    // Initial calculation of dayIndex
    const updateDayIndex = () => {
      const shiftedNow = new Date(Date.now() - 7 * 60 * 60 * 1000);
      const currentYear = shiftedNow.getFullYear();
      const currentMonth = shiftedNow.getMonth();
      const currentDate = shiftedNow.getDate();

      const epochUTC = Date.UTC(2025, 0, 1);
      const currentUTC = Date.UTC(currentYear, currentMonth, currentDate);
      const currentDayIndex = Math.floor((currentUTC - epochUTC) / (1000 * 60 * 60 * 24));
      setDayIndex(currentDayIndex);
    };

    updateDayIndex();

    const timer = setInterval(() => {
      setCountdown(getCountdown());
      // Re-evaluate day index just in case we crossed 7 AM
      updateDayIndex();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const potd = useMemo(() => {
    if (!algorithms || algorithms.length === 0) return null;

    const validDSA = algorithms
      .filter((a) => {
        if (a.problemType !== 'dsa' && a.problemType) return false;
        if (a.published === false) return false;
        if (a.is_premium || a.is_pro || a.metadata?.is_pro) return false;
        if (a.controls?.code_runner === false) return false;
        if (a.controls?.code_runner?.run_code === false) return false;
        return true;
      })
      .sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0));

    if (validDSA.length === 0) return null;

    const shuffled = seededShuffle(validDSA, SEED);
    // Use an absolute value to ensure dayIndex is positive even if before 2025
    const safeDayIndex = Math.max(0, dayIndex);
    
    return shuffled[safeDayIndex % shuffled.length];
  }, [algorithms, dayIndex]);

  return { problem: potd, countdown, dayIndex };
};
