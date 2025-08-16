"""
Document diff computation service for highlighting changes between text versions
"""

import re
import difflib
from typing import List, Dict, Any


class DocumentDiffService:
    """Service for computing document-level diffs optimized for readability"""
    
    def compute_document_diff(self, original: str, revised: str) -> List[Dict[str, Any]]:
        """
        Compute diff between two document texts, optimized for document content
        
        Args:
            original: Original text content
            revised: Revised text content
            
        Returns:
            List of diff segments with change type and content
        """
        if not original.strip() or not revised.strip():
            return self._handle_empty_content(original, revised)
        
        # Check if content looks like JSON (starts with { or [)
        is_json_like = (original.strip().startswith('{') or original.strip().startswith('[')) and (revised.strip().startswith('{') or revised.strip().startswith('['))
        
        if is_json_like:
            # For JSON content, use line-based diffing to preserve structure
            return self._compute_line_based_diff(original, revised)
        else:
            # For regular text, use word-level diffing
            return self._compute_word_based_diff(original, revised)
    
    def _compute_line_based_diff(self, original: str, revised: str) -> List[Dict[str, Any]]:
        """Compute diff using line-based comparison for structured content like JSON"""
        original_lines = original.splitlines(keepends=True)
        revised_lines = revised.splitlines(keepends=True)
        
        matcher = difflib.SequenceMatcher(None, original_lines, revised_lines)
        diff_segments = []
        
        for operation, orig_start, orig_end, rev_start, rev_end in matcher.get_opcodes():
            if operation == 'equal':
                # Unchanged lines
                text = ''.join(original_lines[orig_start:orig_end])
                if text.strip():
                    diff_segments.append({
                        'type': 'unchanged',
                        'text': text,
                        'original': text,
                        'revised': text
                    })
                    
            elif operation == 'delete':
                # Removed lines
                text = ''.join(original_lines[orig_start:orig_end])
                if text.strip():
                    diff_segments.append({
                        'type': 'removed',
                        'text': text,
                        'original': text,
                        'revised': ''
                    })
                    
            elif operation == 'insert':
                # Added lines
                text = ''.join(revised_lines[rev_start:rev_end])
                if text.strip():
                    diff_segments.append({
                        'type': 'added',
                        'text': text,
                        'original': '',
                        'revised': text
                    })
                    
            elif operation == 'replace':
                # Modified lines - show both removed and added
                orig_text = ''.join(original_lines[orig_start:orig_end])
                rev_text = ''.join(revised_lines[rev_start:rev_end])
                
                if orig_text.strip():
                    diff_segments.append({
                        'type': 'removed',
                        'text': orig_text,
                        'original': orig_text,
                        'revised': ''
                    })
                
                if rev_text.strip():
                    diff_segments.append({
                        'type': 'added',
                        'text': rev_text,
                        'original': '',
                        'revised': rev_text
                    })
        
        return diff_segments
    
    def _compute_word_based_diff(self, original: str, revised: str) -> List[Dict[str, Any]]:
        """Compute diff using word-based comparison for regular text"""
        # For documents, we'll work with word-level diffing for natural readability
        original_words = self._split_into_words(original)
        revised_words = self._split_into_words(revised)
        
        # Use SequenceMatcher to find differences
        matcher = difflib.SequenceMatcher(None, original_words, revised_words)
        
        diff_segments = []
        
        for operation, orig_start, orig_end, rev_start, rev_end in matcher.get_opcodes():
            if operation == 'equal':
                # Unchanged text
                text = ' '.join(original_words[orig_start:orig_end])
                if text.strip():
                    diff_segments.append({
                        'type': 'unchanged',
                        'text': text,
                        'original': text,
                        'revised': text
                    })
                    
            elif operation == 'delete':
                # Removed text
                text = ' '.join(original_words[orig_start:orig_end])
                if text.strip():
                    diff_segments.append({
                        'type': 'removed',
                        'text': text,
                        'original': text,
                        'revised': ''
                    })
                    
            elif operation == 'insert':
                # Added text
                text = ' '.join(revised_words[rev_start:rev_end])
                if text.strip():
                    diff_segments.append({
                        'type': 'added',
                        'text': text,
                        'original': '',
                        'revised': text
                    })
                    
            elif operation == 'replace':
                # Modified text - show both removed and added
                orig_text = ' '.join(original_words[orig_start:orig_end])
                rev_text = ' '.join(revised_words[rev_start:rev_end])
                
                if orig_text.strip():
                    diff_segments.append({
                        'type': 'removed',
                        'text': orig_text,
                        'original': orig_text,
                        'revised': ''
                    })
                
                if rev_text.strip():
                    diff_segments.append({
                        'type': 'added',
                        'text': rev_text,
                        'original': '',
                        'revised': rev_text
                    })
        
        return self._merge_adjacent_segments(diff_segments)
    
    def _split_into_words(self, text: str) -> List[str]:
        """Split text into words while preserving whitespace and punctuation context"""
        # Split on whitespace but keep the separators
        words = re.split(r'(\s+)', text.strip())
        # Filter out empty strings
        return [word for word in words if word]
    
    def _handle_empty_content(self, original: str, revised: str) -> List[Dict[str, Any]]:
        """Handle cases where one or both texts are empty"""
        segments = []
        
        if original.strip() and not revised.strip():
            # Everything was removed
            segments.append({
                'type': 'removed',
                'text': original.strip(),
                'original': original.strip(),
                'revised': ''
            })
        elif not original.strip() and revised.strip():
            # Everything was added
            segments.append({
                'type': 'added',
                'text': revised.strip(),
                'original': '',
                'revised': revised.strip()
            })
        
        return segments
    
    def _merge_adjacent_segments(self, segments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Merge adjacent segments of the same type for better readability"""
        if not segments:
            return segments
        
        merged = []
        current = segments[0].copy()
        
        for segment in segments[1:]:
            if (segment['type'] == current['type'] and 
                segment['type'] in ['unchanged', 'added', 'removed']):
                # Merge with current segment
                current['text'] += ' ' + segment['text']
                if segment['type'] == 'unchanged':
                    current['original'] += ' ' + segment['original']
                    current['revised'] += ' ' + segment['revised']
                elif segment['type'] == 'added':
                    current['revised'] += ' ' + segment['revised']
                elif segment['type'] == 'removed':
                    current['original'] += ' ' + segment['original']
            else:
                # Different type, save current and start new
                merged.append(current)
                current = segment.copy()
        
        merged.append(current)
        return merged
    
    def compute_diff_summary(self, diff_segments: List[Dict[str, Any]]) -> Dict[str, int]:
        """Compute summary statistics for the diff"""
        stats = {
            'words_added': 0,
            'words_removed': 0,
            'words_unchanged': 0
        }
        
        for segment in diff_segments:
            word_count = len(segment['text'].split())
            if segment['type'] == 'added':
                stats['words_added'] += word_count
            elif segment['type'] == 'removed':
                stats['words_removed'] += word_count
            elif segment['type'] == 'unchanged':
                stats['words_unchanged'] += word_count
        
        return stats