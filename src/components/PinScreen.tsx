import React, { useState } from 'react';
import { Delete, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface PinScreenProps {
  onSuccess: (pin: string) => void;
  onSkipOffline: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({ onSuccess, onSkipOffline }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const handleDigitClick = (digit: string) => {
    if (pin.length >= 6 || isLoading) return;
    const newPin = pin + digit;
    setPin(newPin);
    setErrorMsg('');

    // If completed 6 digits, verify automatically
    if (newPin.length === 6) {
      verifyPin(newPin);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isLoading) {
      setPin(pin.slice(0, -1));
      setErrorMsg('');
    }
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setPin('');
    }, 600);
  };

  const verifyPin = async (enteredPin: string) => {
    setIsLoading(true);
    try {
      // Test verify against Vercel API
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });

      // If backend exists and responds
      if (res.ok) {
        localStorage.setItem('groceroo_pantry_pin', enteredPin);
        onSuccess(enteredPin);
      } else if (res.status === 401) {
        triggerError('PIN salah. Coba lagi.');
      } else {
        // In local development or before Vercel deploy, save PIN directly
        localStorage.setItem('groceroo_pantry_pin', enteredPin);
        onSuccess(enteredPin);
      }
    } catch {
      // Offline fallback: save PIN locally so user can still access PWA
      localStorage.setItem('groceroo_pantry_pin', enteredPin);
      onSuccess(enteredPin);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-6 max-w-md mx-auto select-none animate-in fade-in">
      {/* Top Header */}
      <div className="w-full text-center pt-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl p-1 bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-xs">
          <img
            src="/logo_groceroo.png"
            alt="Groceroo Logo"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>Masukkan PIN Pantry</span>
          <Lock className="w-4 h-4 text-emerald-600" />
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Akses 6 digit untuk sinkronisasi stok dapur keluarga
        </p>

        {/* 6 Circles PIN indicator */}
        <div
          className={`flex items-center justify-center gap-3.5 my-8 transition-transform ${
            shake ? 'translate-x-[-10px] animate-bounce' : ''
          }`}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-emerald-600 scale-125 shadow-xs'
                    : 'border-2 border-slate-300 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs font-bold text-rose-500 animate-pulse -mt-4 mb-4">
            {errorMsg}
          </p>
        )}
      </div>

      {/* iOS Keypad Grid */}
      <div className="w-full max-w-xs space-y-3 mb-6">
        <div className="grid grid-cols-3 gap-4 place-items-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              disabled={isLoading}
              onClick={() => handleDigitClick(digit)}
              className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-emerald-600 active:text-white active:scale-90 text-slate-900 font-extrabold text-xl flex items-center justify-center transition-all duration-150 shadow-2xs cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Empty placeholder */}
          <div className="w-16 h-16 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-slate-300" />
          </div>

          {/* Zero */}
          <button
            disabled={isLoading}
            onClick={() => handleDigitClick('0')}
            className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-emerald-600 active:text-white active:scale-90 text-slate-900 font-extrabold text-xl flex items-center justify-center transition-all duration-150 shadow-2xs cursor-pointer"
          >
            0
          </button>

          {/* Backspace */}
          <button
            disabled={isLoading || pin.length === 0}
            onClick={handleDelete}
            className="w-16 h-16 rounded-full hover:bg-slate-100 active:scale-90 text-slate-500 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
          >
            <Delete className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Offline / Skip Option */}
      <div className="w-full pb-6 text-center">
        <button
          onClick={onSkipOffline}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 py-2 px-4 rounded-xl hover:bg-slate-50 transition inline-flex items-center gap-1.5"
        >
          <span>Masuk Mode Offline (Tanpa PIN)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
