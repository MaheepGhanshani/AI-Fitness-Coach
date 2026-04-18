import React, { useState } from 'react'
import { FileDown } from 'lucide-react'
import { generatePDF } from '../../utils/pdfGenerator'
import toast from 'react-hot-toast'

const ExportPDF = ({ userDetails, fitnessPlans }) => {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      toast.loading('Generating PDF...', { id: 'pdf' })
      await generatePDF(userDetails, fitnessPlans)
      toast.success('PDF downloaded successfully!', { id: 'pdf' })
    } catch (error) {
      toast.error('Failed to generate PDF', { id: 'pdf' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="btn-secondary flex items-center gap-2"
    >
      <FileDown size={20} />
      {loading ? 'Generating...' : 'Export PDF'}
    </button>
  )
}

export default ExportPDF