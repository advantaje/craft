import { useState, useCallback } from 'react';
import { DocumentSection, SectionData } from '../types/document.types';

const DEFAULT_SECTIONS: DocumentSection[] = [
  { id: '1', name: 'Introduction', type: 'introduction', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false },
  { id: '2', name: 'Background', type: 'background', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false },
  { id: '3', name: 'Usage', type: 'usage', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false },
  { id: '4', name: 'Conclusion', type: 'conclusion', data: { notes: '', outline: '', draft: '', reviewNotes: '' }, isCompleted: false }
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

  const toggleSectionCompletion = useCallback((sectionId: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, isCompleted: !section.isCompleted }
          : section
      )
    );
  }, []);

  const addSection = useCallback((name: string) => {
    const newSection: DocumentSection = {
      id: Date.now().toString(),
      name: name.trim(),
      type: 'custom', // Custom sections use generic prompts
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
    // Don't allow removal of default sections (Introduction, Background, Usage, Conclusion)
    const defaultSectionIds = ['1', '2', '3', '4'];
    return !defaultSectionIds.includes(sectionId);
  }, []);

  const getSectionById = useCallback((sectionId: string) => {
    return sections.find(section => section.id === sectionId);
  }, [sections]);

  return {
    sections,
    updateSectionData,
    toggleSectionCompletion,
    addSection,
    removeSection,
    canRemoveSection,
    getSectionById
  };
}