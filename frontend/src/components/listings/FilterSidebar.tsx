'use client'

interface Filters {
  minPrice: string
  maxPrice: string
  beds: string
  type: string
}

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="flex flex-col gap-4 p-4 border-r border-gray-200 bg-white w-64 shrink-0">
      <h2 className="text-sm font-medium text-gray-900">Filters</h2>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Min price (₱)</label>
        <input
          type="number" placeholder="0" value={filters.minPrice}
          onChange={e => set('minPrice', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Max price (₱)</label>
        <input
          type="number" placeholder="Any" value={filters.maxPrice}
          onChange={e => set('maxPrice', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Min bedrooms</label>
        <select
          value={filters.beds} onChange={e => set('beds', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-gray-500"
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Property type</label>
        <select
          value={filters.type} onChange={e => set('type', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm outline-none focus:border-gray-500"
        >
          <option value="">All types</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="apartment">Apartment</option>
          <option value="lot">Lot</option>
        </select>
      </div>

      <button
        onClick={() => onChange({ minPrice: '', maxPrice: '', beds: '', type: '' })}
        className="text-xs text-gray-500 underline text-left mt-1"
      >
        Clear filters
      </button>
    </div>
  )
}