import React, { useEffect, useState } from 'react'
import '../../global.css'

function formatCurrency(n) {
	return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)
}

export default function LoanPage() {

	const [principal, setPrincipal] = useState(500000)
	const [rate, setRate] = useState(7.5)
	const [tenureYears, setTenureYears] = useState(5)
	const [emi, setEmi] = useState(null)

	function calculateEMI() {
		const P = Number(principal)
		const r = Number(rate) / 12 / 100
		const n = Number(tenureYears) * 12
		if (!P || !n) {
			setEmi(null)
			return
		}
		if (r === 0) {
			setEmi(P / n)
			return
		}
		const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
		setEmi(emiVal)
	}

	return (
		<div style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }} className="min-h-screen bg-gray-50 text-gray-900 p-6">
			<header className="max-w-5xl mx-auto mb-6">
				<h1 className="text-2xl font-semibold flex items-center gap-2">
					<span className="material-symbols-outlined">account_balance</span>
					Bank Loan Dashboard
				</h1>
				<p className="text-sm text-gray-600">Quick loan EMI calculator and sample loan list.</p>
			</header>

			<main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
				<section className="bg-white shadow rounded p-4">
					<h2 className="font-medium mb-3">EMI Calculator</h2>
					<div className="space-y-3">
						<label className="block">
							<div className="text-sm text-gray-700">Principal</div>
							<input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
						</label>

						<label className="block">
							<div className="text-sm text-gray-700">Rate of interest (annual %)</div>
							<input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
						</label>

						<label className="block">
							<div className="text-sm text-gray-700">Tenure (years)</div>
							<input type="number" value={tenureYears} onChange={e => setTenureYears(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
						</label>

						<div className="flex gap-2">
							<button onClick={calculateEMI} className="bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>
							<button onClick={() => { setPrincipal(0); setRate(0); setTenureYears(0); setEmi(null) }} className="px-4 py-2 border rounded">Clear</button>
						</div>

						{emi != null && (
							<div className="mt-3 p-3 bg-gray-100 rounded">
								<div className="text-sm text-gray-700">Monthly EMI</div>
								<div className="text-xl font-semibold">{formatCurrency(emi)}</div>
								<div className="text-sm text-gray-600 mt-1">Total payment: {formatCurrency(emi * tenureYears * 12)}</div>
							</div>
						)}
					</div>
				</section>

				<section className="bg-white shadow rounded p-4">
					<h2 className="font-medium mb-3">Active Loans (sample)</h2>
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="text-gray-600">
								<th className="py-2">Borrower</th>
								<th className="py-2">Amount</th>
								<th className="py-2">Tenure</th>
								<th className="py-2">EMI</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-t"><td className="py-2">Alice</td><td className="py-2">{formatCurrency(250000)}</td><td className="py-2">3 yrs</td><td className="py-2">{formatCurrency(7700)}</td></tr>
							<tr className="border-t"><td className="py-2">Bob</td><td className="py-2">{formatCurrency(750000)}</td><td className="py-2">7 yrs</td><td className="py-2">{formatCurrency(11200)}</td></tr>
						</tbody>
					</table>
				</section>
			</main>
		</div>
	)
}

