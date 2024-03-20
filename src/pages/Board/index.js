import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { cva } from "class-variance-authority";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBomb,
  faCaretDown, faCaretUp,
  faChevronLeft,
  faChevronRight, faFire, faRadiation,
  faSkullCrossbones,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import { useChromeStorage } from "../../hooks/storage";
import { columns, forms, links, username } from "../../service/board";
import FormAction from "../../components/SelectAction";

const cardVariants = cva("bg-slate-800 rounded-md  p-2 gap-2 flex shadow-md", {
  variants: {
    type: {
      default: "border-l-4 border-white",
      feature: "border-l-4 border-emerald-500",
      defect: "border-l-4 border-red-500",
      task: "border-l-4 border-yellow-500",
      improvement: "border-l-4 border-blue-500",
      support: "border-l-4 border-orange-500",
      tests: "border-l-4 border-purple-500",
    },
  }, defaultVariants: {
    type: "default", size: "default"
  }
})

const iconsByPriority = {
  low: faCaretDown,
  high: faCaretUp,
  critical: faTriangleExclamation,
  immediate: faFire,
}

const namesByPrioriry = {
  low: "baixa",
  high: "alta",
  critical: "urgente",
  immediate: "imediato"
}

const colorByPrioriry = {
  low: "text-cyan-500",
  high: "text-yellow-500",
  critical: "text-orange-500",
  immediate: "text-red-500",
}

function Priority({ priority }) {
  const icon = iconsByPriority[priority];
  if (!icon) {
    return;
  }
  return <div className={ `inline-flex items-center gap-1 ${ colorByPrioriry[priority] }` }>
    <FontAwesomeIcon icon={ icon } className="w-4 h-4"/>
    { namesByPrioriry[priority] }
  </div>;
}

const Card = ({ card: { bugId, handler, priority, title, type, points } }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: bugId,
    data: {
      bugId: bugId
    }
  });

  const style = transform ? {
    transform: `translate3d(${ transform.x }px, ${ transform.y }px, 0)`,
  } : undefined;

  return (<a href={ "/view.php?id=" + bugId }>
    <div ref={ setNodeRef } { ...listeners } { ...attributes } style={ style }
         className={ cn(cardVariants({ type, className: isDragging ? "pointer-events-none" : "" })) }>

      <div className="flex flex-col grow gap-1">
        <div>
          <h4 className="text-sm font-mono text-slate-400">#{ bugId }</h4>
          <h3 className="inline-flex items-center gap-1">{ title }</h3>
        </div>
        <Priority priority={ priority }/>
      </div>
      <div className="flex flex-col shrink-0 gap-2 justify-between">
        { handler && <img src={ handler.imageUrl } alt="Handler icon" className="w-9 h-9 rounded-full"/> }
        <div className="inline-flex justify-center items-center rounded-full bg-slate-900 text-slate-200 font-mono text-sm">{ points }</div>
      </div>

    </div>
  </a>);
};

const colorByType = {
  feature: "bg-emerald-500",
  defect: "bg-red-500",
  task: "bg-yellow-500",
  improvement: "bg-blue-500",
  support: "bg-orange-500",
  tests: "bg-purple-500",
}

function CardDot({ card }) {
  return (<div className={ " w-2 h-2 " + colorByType[card.type] }></div>);
}

const Column = ({ column }) => {
  const [ open, setOpen ] = useChromeStorage(column.id + ".open", true)
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    disabled: !open,
    data: {
      mantisId: column.mantisId
    }
  });

  return (<div ref={ setNodeRef }
               className={ "flex flex-shrink-0 content-start " + (open ? "flex-col gap-2 w-64 flex-grow" : "flex-row gap-0.5 flex-wrap w-12") }>
    <div className="flex-shrink-0 w-full flex flex-row">
      <h2 className="whitespace-nowrap overflow-hidden overflow-ellipsis">{ column.name }</h2>
      <Button variant="ghost" size="icon-sm" className="flex-shrink-0 ml-auto"
              onClick={ () => setOpen(!open) }>{ open ? <FontAwesomeIcon icon={ faChevronLeft }/> :
        <FontAwesomeIcon icon={ faChevronRight }/> }</Button>
    </div>
    { column.cards.map((card, i) => open ? <Card key={ card.bugId } card={ card }/> :
      <CardDot key={ card.bugId } card={ card }/>) }
  </div>)
};

const Board = () => {
  const [ data, setData ] = useState(columns);
  const clonedRef = useRef(null);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));

  const handleDrag = ({ active, over }) => {
    if (!over) {
      return;
    }
    setData((prevData) => {
      const newColumns = [ ...prevData ];

      const sourceColumnIndex = newColumns.findIndex((col) => col.cards.some((card) => card.bugId === active.id));
      const destinationColumnIndex = newColumns.findIndex((col) => col.id === over.id);
      const cardIndex = newColumns[sourceColumnIndex].cards.findIndex((card) => card.bugId === active.id);
      const [ draggedCard ] = newColumns[sourceColumnIndex].cards.splice(cardIndex, 1);
      newColumns[destinationColumnIndex].cards.unshift(draggedCard);

      return newColumns;
    })


  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }
    const { bugId } = active.data.current;
    const { mantisId } = over.data.current;
    const data = {
      username,
      bugid: bugId,
      columnstatus: mantisId,
    };

    fetch("plugins/Scrum/pages/webservice.php?json=" + JSON.stringify(data), {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    })
      .catch(error => console.log(error));

  }

  return (<DndContext
    sensors={ sensors }
    onDragStart={ () => {
      clonedRef.current = [ ...data ]
    } }
    onDragOver={ handleDrag }
    onDragEnd={ handleDragEnd }
    onDragCancel={ () => {
      setData(clonedRef.current);
      clonedRef.current = null;
    } }>
    <div className="flex flex-row overflow-scroll h-screen space-x-4 p-4">
      { data.map((column, i) => <Column key={ column.id } column={ column }/>) }
    </div>
  </DndContext>);
};


export default () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-stone-950 text-zinc-100">
      <div className="flex flex-row gap-3 px-4 py-2">
        { links.map((link) => <a key={ link.href } href={ link.href } className="hover:underline">{ link.title }</a>) }
        <FormAction id="project" value="Mudar projeto" { ...forms.setProject } buttonAtEnd className="ml-auto"  />
      </div>
      <div className="flex px-4 py-2">
        <FormAction id="filtro" value="Filtrar" { ...forms.filter } buttonAtEnd />
        <FormAction id="goto" value="Ir para" { ...forms.jumpToBug } buttonAtEnd className="ml-auto" />
      </div>
      <Board/>
    </div>
  );
}