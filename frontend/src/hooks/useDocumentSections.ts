import { useState, useCallback } from 'react';
import { DocumentSection, SectionData } from '../types/document.types';
import { getSectionDefaultGuidelines, SectionGuidelines } from '../config/defaultGuidelines';

const DEFAULT_SECTIONS: DocumentSection[] = [
  { 
    id: '1', 
    name: 'Background', 
    type: 'background', 
    templateTag: 'background', 
    guidelines: getSectionDefaultGuidelines('background'),
    data: { notes: '', outline: '', draft: '', reviewNotes: '' }, 
    isCompleted: false 
  },
  { 
    id: '2', 
    name: 'Product', 
    type: 'product', 
    templateTag: 'product', 
    guidelines: getSectionDefaultGuidelines('product'),
    data: { notes: '', outline: '', draft: '', reviewNotes: '' }, 
    isCompleted: false 
  },
  { 
    id: '3', 
    name: 'Usage', 
    type: 'usage', 
    templateTag: 'usage', 
    guidelines: getSectionDefaultGuidelines('usage'),
    data: { notes: '', outline: '', draft: '', reviewNotes: '' }, 
    isCompleted: false 
  },
  { 
    id: '4', 
    name: 'Model Limitations', 
    type: 'model_limitations', 
    templateTag: 'model_limitations', 
    guidelines: getSectionDefaultGuidelines('model_limitations'),
    data: { notes: '', outline: '', draft: '{"rows":[]}', reviewNotes: '' }, 
    isCompleted: false 
  },
  { 
    id: '5', 
    name: 'Model Risk Issues', 
    type: 'model_risk_issues', 
    templateTag: 'model_risk_issues', 
    guidelines: getSectionDefaultGuidelines('model_risk_issues'),
    data: { notes: '', outline: '', draft: '{"rows":[]}', reviewNotes: '' }, 
    isCompleted: false 
  }
];

export function useDocumentSections() {
  const [sections, setSections] = useState<DocumentSection[]>(DEFAULT_SECTIONS);

  const updateSectionData = useCallback((
    sectionId: string,
    field: keyof SectionData,
    value: string
  ) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, data: { ...section.data, [field]: value } }
          : section
      )
    );
  }, []);

  const toggleSectionCompletion = useCallback((sectionId: string, completionType: 'normal' | 'empty' | 'unexclude' = 'normal') => {
    setSections(prevSections =>
      prevSections.map(section => {
        if (section.id !== sectionId) return section;

        // Handle unexcluding
        if (completionType === 'unexclude' && section.completionType === 'empty') {
          return {
            ...section,
            isCompleted: section.wasCompleted || false,
            completionType: section.wasCompleted ? 'normal' : undefined,
            wasCompleted: undefined
          };
        }

        // Handle excluding
        if (completionType === 'empty') {
          return {
            ...section,
            wasCompleted: section.isCompleted,
            isCompleted: true,
            completionType: 'empty'
          };
        }

        // Handle normal toggle (existing logic)
        return {
          ...section,
          isCompleted: !section.isCompleted,
          completionType: section.isCompleted ? undefined : (completionType === 'normal' ? 'normal' : undefined),
          wasCompleted: undefined
        };
      })
    );
  }, []);

  const addSection = useCallback((name: string, templateTag?: string) => {
    const newSection: DocumentSection = {
      id: Date.now().toString(),
      name: name.trim(),
      type: 'custom', // Custom sections use generic prompts
      templateTag: templateTag?.trim() || undefined,
      guidelines: getSectionDefaultGuidelines('default'), // Use default guidelines for new sections
      data: { notes: '', outline: '', draft: '', reviewNotes: '' },
      isCompleted: false
    };
    setSections(prevSections => [...prevSections, newSection]);
    return newSection;
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setSections(prevSections =>
      prevSections.filter(section => section.id !== sectionId)
    );
  }, []);

  const canRemoveSection = useCallback((sectionId: string) => {
    // Don't allow removal of default sections (Background, Product, Usage, Model Limitations, Model Risk Issues)
    const defaultSectionIds = ['1', '2', '3', '4', '5'];
    return !defaultSectionIds.includes(sectionId);
  }, []);

  const updateSectionTemplateTag = useCallback((sectionId: string, templateTag: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, templateTag: templateTag.trim() || undefined }
          : section
      )
    );
  }, []);

  const updateSectionGuidelines = useCallback((sectionId: string, guidelines: SectionGuidelines) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, guidelines }
          : section
      )
    );
  }, []);

  const getSectionById = useCallback((sectionId: string) => {
    return sections.find(section => section.id === sectionId);
  }, [sections]);

  return {
    sections,
    updateSectionData,
    updateSectionTemplateTag,
    updateSectionGuidelines,
    toggleSectionCompletion,
    addSection,
    removeSection,
    canRemoveSection,
    getSectionById
  };
}