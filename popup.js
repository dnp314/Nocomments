// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const removeCommentsButton = document.getElementById('remove-comments');
  const languageSelect = document.getElementById('language-select');
  const successMessage = document.getElementById('success-message');
  
  removeCommentsButton.addEventListener('click', async function() {
    try {
      // Get text from clipboard
      const text = await navigator.clipboard.readText();
      const language = languageSelect.value;
      
      // Auto-detect language if set to auto
      const detectedLanguage = language === 'auto' ? detectLanguage(text) : language;
      
      // Remove comments based on language
      const cleanedText = removeComments(text, detectedLanguage);
      
      // Write cleaned text back to clipboard
      await navigator.clipboard.writeText(cleanedText);
      
      // Show success message
      successMessage.style.display = 'block';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 2000);
    } catch (err) {
      console.error('Failed to read/write clipboard:', err);
    }
  });
  
  function detectLanguage(code) {
    // Simple language detection based on file extensions and syntax patterns
    if (code.includes('<?php') || code.includes('<?=')) {
      return 'php';
    } else if (code.includes('<!DOCTYPE html') || code.includes('<html')) {
      return 'html';
    } else if (code.includes('import React') || code.includes('function(') || code.includes('const ') || code.includes('let ')) {
      return 'javascript';
    } else if (code.includes('def ') || code.includes('import ') && !code.includes('{')) {
      return 'python';
    } else if (code.includes('public class') || code.includes('private ') || code.includes('protected ')) {
      return 'java';
    } else if (code.includes('#include') || code.includes('int main(')) {
      return 'cpp';
    } else if (code.includes('@media') || code.includes('@keyframes') || code.includes('{') && code.includes(':')) {
      return 'css';
    } else if (code.includes('func ') && code.includes('package ')) {
      return 'go';
    } else if (code.includes('fn ') && code.includes('let mut ')) {
      return 'rust';
    } else if (code.includes('class ') && code.includes('end') && code.includes('def ')) {
      return 'ruby';
    } else if (code.includes('import ') && code.includes('struct ') && code.includes('extension ')) {
      return 'swift';
    }
    
    // Default to JavaScript if unable to detect
    return 'javascript';
  }
  
  function removeComments(code, language) {
    let result = code;
  
    switch (language) {
      case 'javascript':
      case 'java':
      case 'cpp':
      case 'css':
      case 'go':
      case 'swift':
      case 'rust':
        // Remove /* */ comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, '');
        // Remove // comments while preserving the line break
        result = result.replace(/\/\/.*?($|\r\n|\r|\n)/gm, '$1');
        break;
        
      case 'python':
      case 'ruby':
        // Remove # comments while preserving the line break
        result = result.replace(/#.*?($|\r\n|\r|\n)/gm, '$1');
        // Remove """ """ multi-line comments (Python)
        result = result.replace(/"""[\s\S]*?"""/g, '');
        // Remove ''' ''' multi-line comments (Python)
        result = result.replace(/'''[\s\S]*?'''/g, '');
        break;
        
      case 'html':
        // Remove <!-- --> comments
        result = result.replace(/<!--[\s\S]*?-->/g, '');
        break;
        
      case 'php':
        // Additional PHP-specific comments
        result = result.replace(/\/\*[\s\S]*?\*\//g, ''); // /* */ comments
        result = result.replace(/\/\/.*?($|\r\n|\r|\n)/gm, '$1'); // // comments
        result = result.replace(/#.*?($|\r\n|\r|\n)/gm, '$1'); // # comments
        break;
    }
    
    // Remove consecutive empty lines but preserve indentation
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return result;
  }
});