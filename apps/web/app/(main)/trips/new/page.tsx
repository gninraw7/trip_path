'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTrip } from '../../../../hooks/use-trips';
import type { TripVisibility } from '@trip-path/shared-types';

/**
 * 새 여행 생성 페이지
 * 설계서 Section 6.4: POST /trips
 * BR-TRIP-001: 제목, 시작일, 종료일 필수
 */
export default function NewTripPage() {
  const router = useRouter();
  const createTrip = useCreateTrip();

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    destinationCountry: '',
    destinationCity: '',
    totalBudget: '',
    currency: 'KRW',
    visibility: 'PRIVATE' as TripVisibility,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrip.mutate(
      {
        title: form.title,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        destinationCountry: form.destinationCountry || undefined,
        destinationCity: form.destinationCity || undefined,
        totalBudget: form.totalBudget ? Number(form.totalBudget) : undefined,
        currency: form.currency,
        visibility: form.visibility,
      },
      {
        onSuccess: (response) => {
          router.push(`/trips/${response.data.id}`);
        },
      },
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">새 여행 만들기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            여행 제목 *
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="도쿄 3박 4일 여행"
            maxLength={200}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            설명
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
            placeholder="여행에 대한 설명을 입력하세요"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              시작일 *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              종료일 *
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="destinationCountry" className="block text-sm font-medium mb-1">
              목적지 국가
            </label>
            <input
              id="destinationCountry"
              name="destinationCountry"
              value={form.destinationCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Japan"
            />
          </div>
          <div>
            <label htmlFor="destinationCity" className="block text-sm font-medium mb-1">
              목적지 도시
            </label>
            <input
              id="destinationCity"
              name="destinationCity"
              value={form.destinationCity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Tokyo"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalBudget" className="block text-sm font-medium mb-1">
              총 예산
            </label>
            <input
              id="totalBudget"
              name="totalBudget"
              type="number"
              value={form.totalBudget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="1500000"
              min={0}
            />
          </div>
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium mb-1">
              공개 설정
            </label>
            <select
              id="visibility"
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="PRIVATE">비공개</option>
              <option value="PUBLIC">공개</option>
              <option value="UNLISTED">링크 공유</option>
            </select>
          </div>
        </div>

        {createTrip.error && (
          <p className="text-sm text-destructive">여행 생성에 실패했습니다.</p>
        )}

        <button
          type="submit"
          disabled={createTrip.isPending}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {createTrip.isPending ? '생성 중...' : '여행 만들기'}
        </button>
      </form>
    </div>
  );
}
