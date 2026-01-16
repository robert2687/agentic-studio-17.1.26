import React from 'react';
import { FileNode } from '../types';
import { Folder, FileCode, FileJson, ChevronRight, ChevronDown, File } from 'lucide-react';

interface FileExplorerProps
{
  files: FileNode[];
  activeFile: string | null;
}

const FileIcon = ( { name }: { name: string } ) =>
{
  if ( name.endsWith( '.tsx' ) || name.endsWith( '.ts' ) ) return <FileCode size={ 14 } className="text-blue-400" />;
  if ( name.endsWith( '.json' ) ) return <FileJson size={ 14 } className="text-yellow-400" />;
  if ( name.endsWith( '.css' ) ) return <FileCode size={ 14 } className="text-sky-300" />;
  return <File size={ 14 } className="text-slate-400" />;
};

interface FileTreeItemProps
{
  node: FileNode;
  depth: number;
  activeFile: string | null;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ( { node, depth, activeFile } ) =>
{
  const [ isOpen, setIsOpen ] = React.useState( node.isOpen || false );
  const isActive = activeFile === node.name;

  return (
    <div>
      <div
        className={ `flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none hover:bg-ide-panel transition-colors ${ isActive ? 'bg-ide-panel text-white' : 'text-slate-400' }` }
        style={ { paddingLeft: `${ depth * 12 + 8 }px` } }
        onClick={ () => node.type === 'folder' && setIsOpen( !isOpen ) }
      >
        { node.type === 'folder' && (
          <span className="text-slate-500">
            { isOpen ? <ChevronDown size={ 14 } /> : <ChevronRight size={ 14 } /> }
          </span>
        ) }

        { node.type === 'folder' ? (
          <Folder size={ 14 } className={ isOpen ? 'text-slate-200' : 'text-slate-400' } />
        ) : (
          <FileIcon name={ node.name } />
        ) }

        <span className="text-sm truncate">{ node.name }</span>
      </div>

      { node.type === 'folder' && isOpen && node.children && (
        <div className="flex flex-col">
          { node.children.map( ( child, idx ) => (
            <FileTreeItem key={ idx } node={ child } depth={ depth + 1 } activeFile={ activeFile } />
          ) ) }
        </div>
      ) }
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ( { files, activeFile } ) =>
{
  return (
    <div className="flex flex-col h-full bg-ide-sidebar border-r border-ide-border w-64 flex-shrink-0">
      <div className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
        <span>Explorer</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        { files.map( ( file: FileNode, idx: React.Key ) => (
          <FileTreeItem key={ idx } node={ file } depth={ 0 } activeFile={ activeFile } />
        ) ) }
      </div>
    </div>
  );
};

export default FileExplorer;